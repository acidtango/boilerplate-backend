# Onboarding guide — `boilerplate-backend` for Android developers

A recap of the walkthrough. Reads bottom-up: mental model, then layer tour using the `talks` feature as the running example, then how to add a feature, then testing.

---

## Context for picking this back up cold

- **Who this is for**: Abraham, an Android developer new to TypeScript and backend work. Concepts here are anchored to Android idioms (Hilt, Repository, Interactor, Room, Espresso).
- **What this repo is**: `codetalk-pure` — a Hexagonal Architecture + DDD Node/TypeScript boilerplate. Stack: **Hono** (HTTP), **Inversify** (DI), **MongoDB** (persistence), **AWS SQS** via LocalStack (event bus), **Zod + hono-openapi** (DTOs + Swagger), **Vitest** (tests), **Biome** (lint/format), **pnpm** (package manager).
- **Bounded contexts** live under `src/`: `talks/`, `speakers/`, `events/`, `auth/`, `shared/`. Each context has the same shape: `domain/{models,repositories,services,errors,events}`, `use-cases/`, `infrastructure/{controllers,repositories}`.
- **Best files to skim first**, in order:
  1. `src/container.ts` — the DI wiring, gives you the whole feature list at a glance.
  2. `src/shared/infrastructure/controllers/CreateHono.ts` — how endpoints/middleware are assembled.
  3. `src/talks/domain/models/Talk.ts` — a canonical Aggregate Root.
  4. `src/talks/use-cases/ProposeTalk.ts` — a canonical Use Case.
  5. `src/talks/infrastructure/controllers/ProposeTalkEndpoint.ts` — a canonical Controller.
- **Where the exercise left off**: §4 sketches a hands-on task — implement **"reject a talk"** (`POST /api/v1/talks/:id/reject`) end-to-end. Not started yet. The template files to copy from are `ApproveTalk.ts`, `ApproveTalkEndpoint.ts`, `approve-talk.e2e-test.ts`, and `TalkCannotBeApprovedError.ts`.
- **Non-obvious conventions**:
  - Every domain object exposes `fromPrimitives` / `toPrimitives` for DB and wire (de)serialisation.
  - Every use case has a `static create({ container })` Inversify factory hook.
  - IDs are class-branded (`TalkId`, `SpeakerId`) — the private `TOKEN` field prevents cross-type assignment even though both wrap a `string`.
  - New `DomainError` requires three edits: the error class, `DomainErrorCode` enum, and `domainErrorToHttpStatusCode` map.
  - File imports must include the `.ts` extension (`tsconfig.json` sets `allowImportingTsExtensions`).
- **The single load-bearing rule**: **no framework imports in `src/**/domain/**`** (no `hono`, `mongodb`, `inversify`, `zod`). If you're tempted, add an interface in `domain/` and implement it in `infrastructure/`.

---

## 1. Mental model — the parts you already know, with new names

This is **Hexagonal Architecture + Domain-Driven Design (DDD)**. Every Android app that follows Google's "Guide to app architecture" already looks like this.

| Android | This repo | Where |
|---|---|---|
| Activity / Fragment / route handler | **Controller / Endpoint** | `src/talks/infrastructure/controllers/ProposeTalkEndpoint.ts` |
| Kotlin `data class` with `require { }` in `init` | **Value Object** | `src/talks/domain/models/TalkTitle.ts` |
| Domain entity (`User`, `Talk`) | **Aggregate Root** | `src/talks/domain/models/Talk.ts` |
| `Repository` interface (in `domain` module) | **Repository interface** | `src/talks/domain/repositories/TalkRepository.ts` |
| `RepositoryImpl` (Room / Retrofit impl) | **RepositoryMongo / RepositoryMemory** | `src/talks/infrastructure/repositories/TalkRepositoryMongo.ts` |
| `Interactor` / `UseCase` class | **Use Case** | `src/talks/use-cases/ProposeTalk.ts` |
| Hilt `@Module` / `@Provides` | **Inversify container bindings** | `src/container.ts` |
| Kotlin `sealed class` for errors | **`DomainError` subclasses** | `src/talks/domain/errors/TalkNotFoundError.ts` |
| `LiveData` / `Flow` events | **Domain events + Event Bus** | `src/talks/domain/events/TalkProposed.ts` |
| `@Serializable` DTO for API JSON | **Zod DTO** | `src/talks/infrastructure/controllers/dtos/ProposeTalkRequestDTO.ts` |
| JUnit tests | **Vitest unit tests** (`*.test.ts`) | `src/talks/use-cases/ProposeTalk.test.ts` |
| Instrumented / Espresso tests | **e2e tests** (`*.e2e-test.ts`) | `test/api/talks/propose-talk.e2e-test.ts` |
| Room in-memory DB for tests | **RepositoryMemory + Fakes** | `test/fakes/TalkRepositoryFake.ts` |

**Hexagonal in one sentence**: the `domain/` folder is a pure Kotlin/Java-style core with zero framework imports; everything else (HTTP, DB, queues) lives in `infrastructure/` and adapts the outside world *to* the domain — never the other way around.

### TypeScript quick vocabulary

- `interface` and `type` — both describe shapes. Prefer `type` for aliases, `interface` when other code will `extends` it.
- `readonly` on class fields = Kotlin `val`. No `readonly` = Kotlin `var`.
- `import { X } from './foo.ts'` — the `.ts` extension is required here (`tsconfig.json:7` sets `allowImportingTsExtensions`).
- `async`/`await` = Kotlin `suspend fun`. `async` functions return `Promise<T>`.
- `Promise.all([a, b, c])` = `awaitAll(a, b, c)` — runs in parallel.
- `?.` and `??` = safe call and Elvis, same semantics as Kotlin.
- `satisfies X` = "check I match X but keep my narrow type" (see `ProposeTalkEndpoint.ts:47`).

---

## 2. Layer tour, following `talks` end-to-end

Bottom-up so each layer makes sense before the next uses it.

### 2.1 Value Object — `TalkTitle`

File: `src/talks/domain/models/TalkTitle.ts:4-28`

```ts
export class TalkTitle extends ValueObject {
  private static readonly MAX_LENGTH = 100
  private readonly title: string

  constructor(title: string) {
    super()
    this.title = title
    this.ensureIsNotTooLong()
  }

  private ensureIsNotTooLong() {
    if (this.title.length > TalkTitle.MAX_LENGTH) {
      throw new TalkTitleTooLongError()
    }
  }

  static fromPrimitives(title: string): TalkTitle { return new TalkTitle(title) }
  toPrimitives() { return this.title }
}
```

- Constructor **validates** on creation. If `title` is invalid, the object can't exist.
- Project-wide contract: **rehydrate** from raw values with `fromPrimitives`, **serialise** back with `toPrimitives`.
- Zero framework, zero I/O.

`ValueObject` (`src/shared/domain/models/hex/ValueObject.ts:1`) is a marker class — no behaviour, just intent.

### 2.2 Domain ID — `TalkId`

File: `src/shared/domain/models/ids/TalkId.ts`

```ts
export class TalkId extends DomainId {
  private readonly TOKEN = 'TalkId'
  static fromPrimitives(id: string): TalkId { return new TalkId(id) }
}
```

The `TOKEN` field is a **branding trick** so TypeScript refuses to accept a `SpeakerId` where a `TalkId` is required, even though both wrap a `string` at runtime. Equivalent to Kotlin `@JvmInline value class TalkId(val raw: String)`.

### 2.3 Aggregate Root — `Talk`

File: `src/talks/domain/models/Talk.ts:19-148`

Patterns to copy:

1. **Private constructor + named factory methods** — `Talk.proposal(...)` (line 56), `Talk.fromPrimitives(...)` (line 30). Callers can't create half-baked aggregates.
2. **Business rules live as methods** — `approve()` (line 124), `assignForReviewTo()` (line 100). They throw domain errors when invariants are violated. Never put business `if/else` in a controller or service.
3. **`recordEvent(...)`** (line 67) — after a state change, the aggregate remembers what happened. The use-case later calls `pullDomainEvents()` (`AggregateRoot.ts:10`) and publishes them.

### 2.4 Domain Error — `TalkNotFoundError`

File: `src/talks/domain/errors/TalkNotFoundError.ts`

```ts
export class TalkNotFoundError extends DomainError {
  constructor(notExistentId: TalkId) {
    super(`Talk with id ${notExistentId.toPrimitives()} not found`,
          DomainErrorCode.TALK_DOES_NOT_EXISTS)
  }
}
```

Business errors extend `DomainError`. The HTTP mapping happens in `src/shared/infrastructure/errors/domainErrorToHttpStatusCode.ts:12-27` — one lookup from error code → status (400/404/409/…). Adding a new `DomainError` means adding a code to the enum and one line to that map.

### 2.5 Repository interface

File: `src/talks/domain/repositories/TalkRepository.ts`

```ts
export interface TalkRepository {
  save(talk: Talk): Promise<void>
  findBy(talkId: TalkId): Promise<Talk | undefined>
}
```

Domain doesn't know whether the implementation is Mongo, Postgres, or in-memory. Two implementations:

- `src/talks/infrastructure/repositories/TalkRepositoryMongo.ts` — real DB (`updateOne` + `upsert`).
- `src/talks/infrastructure/repositories/TalkRepositoryMemory.ts` — in-memory `Map` for tests.

### 2.6 Domain Service — `TalkFinder`

File: `src/talks/domain/services/TalkFinder.ts`

Small helper that wraps a repository with domain semantics — `findOrThrowBy(id)` throws `TalkNotFoundError` if missing. Use-cases call it instead of null-checking every time.

### 2.7 Use Case — `ProposeTalk`

File: `src/talks/use-cases/ProposeTalk.ts:28-80`

```ts
async execute({ cospeakers, description, eventId, id, language, speakerId, title }) {
  const speaker = await this.speakerFinder.findOrThrowBy(speakerId)     // 1
  speaker.ensureHasProfileFilled()                                       // 2
  await this.eventFinder.ensureExists(eventId)                           // 3
  const talk = Talk.proposal(id, title, description, language, cospeakers, speakerId, eventId) // 4
  await this.talkRepository.save(talk)                                   // 5
  await this.eventBus.publish(talk.pullDomainEvents())                   // 6
}
```

1. Load the speaker (throws if missing).
2. Enforce a business rule on the speaker aggregate.
3. Check the event exists.
4. Construct the aggregate via the factory (title/description validate themselves).
5. Persist.
6. Emit the domain event (`TalkProposed`) so subscribers can react — e.g. `TalkProposedSubscriber` sends a confirmation email (`src/talks/use-cases/subscribers/TalkProposedSubscriber.ts:57`).

**Guidelines**:
- One class per user intent. Name as a verb: `ProposeTalk`, `ApproveTalk`, `GetTalk`.
- Constructor takes interfaces (repositories, services). Never `new SomeRepositoryMongo()` inside — DI provides it.
- The `static create({ container })` method (line 37) is the Inversify factory hook. Every use case has this pattern.
- No HTTP, no `req`/`res`, no framework. Need a UUID → inject a `Crypto`/`UuidGenerator`. Need "now" → inject a `Clock`.

### 2.8 Controller / Endpoint — `ProposeTalkEndpoint`

File: `src/talks/infrastructure/controllers/ProposeTalkEndpoint.ts:13-47`

```ts
export const ProposeTalkEndpoint = {
  method: 'post' as const,
  path: '/api/v1/talks',
  handlers: factory.createHandlers(
    describeRoute({ ... }),                       // OpenAPI/Swagger metadata
    validator('json', ProposeTalkRequestDTO),     // Zod validates the JSON body
    async (c) => {
      const proposeTalk = await c.var.container.getAsync(ProposeTalk)
      const body = c.req.valid('json')
      await proposeTalk.execute({
        id: TalkId.fromPrimitives(body.id),
        title: TalkTitle.fromPrimitives(body.title),
        // ...
      })
      return c.body(null, 201)
    },
  ),
} satisfies Endpoint
```

Three responsibilities only:
1. **Declare the route** (method + path + Swagger doc).
2. **Validate** raw JSON with a Zod DTO.
3. **Translate** raw primitives → domain types, call the use case, translate back.

No business logic here. If you're writing an `if` about business state, it belongs in the aggregate or the use case.

### 2.9 DTO — `ProposeTalkRequestDTO`

File: `src/talks/infrastructure/controllers/dtos/ProposeTalkRequestDTO.ts`

Zod schemas describe both runtime validation AND the OpenAPI schema. Analogous to `@Serializable data class` with validation annotations.

### 2.10 DI wiring — `container.ts`

File: `src/container.ts:39-93`

Every new implementation needs one line here. Four groups:

- **Use Cases** (lines 42–53): `container.bind(ProposeTalk).toDynamicValue(ProposeTalk.create)`
- **Controllers** (lines 56–65): bound under a shared `Token.ENDPOINT` so `createHono` (`src/shared/infrastructure/controllers/CreateHono.ts:23`) iterates all of them.
- **Subscribers** (line 68): shared `Token.SUBSCRIBER` for the same reason.
- **Repositories & services** (lines 71+): bound under one-of-a-kind tokens.

If you forget to bind, the app 404s or crashes.

---

## 3. Full request lifecycle — one `POST /api/v1/talks`

1. Hono runs middleware in order:
   - `containerMiddleware` puts the DI container on `c.var.container` (`CreateHono.ts:20`).
   - `requestContextMiddleware`, `loggerMiddleware`.
   - JWT auth (line 26) unless `secured: false`.
2. Route matches `ProposeTalkEndpoint`. Zod validates the body → auto 400 if invalid.
3. Handler resolves `ProposeTalk` from the container.
4. Handler converts primitives to VOs (`TalkId.fromPrimitives`, etc.). VO validation runs here (e.g. "title too long").
5. `ProposeTalk.execute` runs the six steps from §2.7. Any `DomainError` bubbles up.
6. `handle` (`ErrorHandler.ts:9`) catches errors:
   - `DomainError` → JSON with the right HTTP code via `domainErrorToHttpStatusCode`.
   - Anything else → 500.
7. On success, handler returns `c.body(null, 201)`.
8. `EventBusSQS.publish` has already sent `TalkProposed` to SQS. Later, `TalkProposedSubscriber.on(...)` reacts and sends the email.

---

## 4. Recipe: adding a new feature

Example: **"Reject a talk"** (`POST /api/v1/talks/:id/reject`, sets `isApproved = false`).

Do it in this order — each step compiles and can be unit-tested before the next:

**Step 1 — Domain method on the aggregate.**
Edit `src/talks/domain/models/Talk.ts`:
```ts
reject() {
  if (!this.hasStatus(TalkStatus.REVIEWING)) throw new TalkCannotBeRejectedError(this.id)
  this.isApproved = false
}
```
Add `TalkCannotBeRejectedError` under `src/talks/domain/errors/`, following `TalkCannotBeApprovedError.ts`. Add its code to `DomainErrorCode.ts` and one line to `domainErrorToHttpStatusCode.ts:12`.

**Step 2 — Unit test the aggregate rule.**
Extend `src/talks/domain/models/Talk.test.ts`. Assert `reject()` throws on a proposal talk, and that `hasStatus(REJECTED)` is true after `reject()` on a reviewed talk.

**Step 3 — Use case.**
Create `src/talks/use-cases/RejectTalk.ts`, copying `ApproveTalk.ts` and swapping `approve()` → `reject()`. Keep the `static create({ container })` boilerplate.

**Step 4 — Unit test the use case.**
Copy `ApproveTalk.test.ts`. Use `TalkRepositoryFake`, `EventBusFake`, and Object Mothers.

**Step 5 — Controller.**
Create `src/talks/infrastructure/controllers/RejectTalkEndpoint.ts` from `ApproveTalkEndpoint.ts`.

**Step 6 — Wire in the container.**
In `src/container.ts`:
```ts
container.bind(RejectTalk).toDynamicValue(RejectTalk.create)
container.bind(Token.ENDPOINT).toConstantValue(RejectTalkEndpoint)
```

**Step 7 — e2e test.**
Add `test/api/talks/reject-talk.e2e-test.ts` copying `approve-talk.e2e-test.ts`.

Order matters: **domain → use case → controller → DI wiring → tests at each layer**.

---

## 5. Testing — three tiers, three file suffixes

The Vitest configs in `test/config/*.ts` route each suffix to a different runner:

| Suffix | Config | Purpose | Android analog |
|---|---|---|---|
| `*.test.ts` | `vitest.unitary.ts` | Pure unit tests, no I/O | JUnit unit test |
| `*.integration-test.ts` | `vitest.integration.ts` | Real Mongo/SQS via Docker | Room test with in-memory DB |
| `*.e2e-test.ts` (+`*.test.ts`) | `vitest.e2e-db.ts` | Boot the whole app + HTTP client | Espresso / instrumented |

Commands:
- `pnpm test:unitary` — fast, run constantly.
- `pnpm test:integration` — needs Docker (`docker compose up db aws`).
- `pnpm test:e2e:db` — needs Docker + spins the app.

### 5.1 Unit tests — Fakes + Object Mothers

Real example: `src/talks/use-cases/ProposeTalk.test.ts:28-86`.

**Fakes** (`test/fakes/TalkRepositoryFake.ts`) extend the in-memory implementation and add test-only helpers like `getLatestSavedTalk()`. Never mock repositories with generic mocking libraries — use Fakes so tests exercise the real interface contract.

**Object Mothers** (`test/mother/TalkMother/JuniorXp.ts`) are fixture builders. `juniorXpTalk({ cospeakers = [...] } = {})` gives a valid `Talk` in one call, with defaults you can override.

The `= {}` at the end of the parameter list is the TS idiom for "allow calling with no args and destructure defaults". Combined with destructuring defaults, this is Kotlin's `fun juniorXpTalk(cospeakers: List<String> = defaultCospeakers)`.

### 5.2 Integration tests — real DB

Example: `src/talks/infrastructure/repositories/TalkRepository.integration-test.ts`. Verify `TalkRepositoryMongo` truly round-trips `save → findBy → equals`. Needed because unit tests all use the in-memory version.

### 5.3 e2e tests — spin the whole thing

Example: `test/api/talks/propose-talk.e2e-test.ts:8-40`. `createClient()` starts the Hono app in-process and returns a typed client with methods like `client.proposeTalk({...})`.

```ts
await expect(client.getTalk(JUNIOR_XP.id)).hasBody({ status: 'PROPOSAL', ... })
```

`.hasBody(...)` is a custom matcher (see `test/vitest.d.ts`).

### 5.4 Rule of thumb

- **Domain models** and **use cases** → unit tests. Aim for near-100% coverage here; cheap and pure.
- **Repositories** → one integration test per implementation.
- **Full workflows / auth / error mapping** → one e2e per happy path.

---

## 6. TypeScript idioms you'll bump into

- `import type { X } from '...'` — imports erased at runtime. Combined with `verbatimModuleSyntax` (`tsconfig.json:7`), this repo requires `type` on any import used *only* in type positions.
- `as const` — freezes a literal into its narrow type. `method: 'post' as const` keeps the string as `'post'`, not `string`.
- `satisfies X` — validates without widening. `... satisfies Endpoint` checks the shape but preserves the specific `method: 'post'` for inference.
- `Record<K, V>` — dictionary. `Record<DomainErrorCode, HttpStatus>` forces you to include every enum member; the compiler yells if you miss one. That's how adding a new error code stays compiler-guided.
- `Promise<T>` — the type of an async result. `async function foo(): Promise<Talk>`.
- `{ a, b, c }: SomeType` in a parameter list — destructuring, same as Kotlin `(dto: SomeType) -> val (a, b, c) = dto`.

---

## 7. Commands

```
pnpm install                # once
docker compose up db aws    # for integration/e2e — Mongo + LocalStack SQS
pnpm start:dev              # dev server, hot-reload on save
pnpm typecheck              # tsc, no emit — before commits
pnpm check                  # Biome lint + format check
pnpm check:fix              # auto-fix formatting
pnpm test:unitary           # fastest, run constantly
pnpm test:integration       # slower, requires Docker
pnpm test:e2e:db            # full stack
pnpm precommit              # typecheck + biome check
```

Swagger UI: `http://localhost:8080/ui` after `pnpm start:dev`. Generated from `describeRoute(...)` + Zod DTOs.

---

## The one rule that keeps you out of trouble

> Never import anything from `hono`, `mongodb`, `inversify`, `zod`, or any framework package inside a file under `src/**/domain/**`.

If you feel tempted to, the boundary is wrong — extract an interface in `domain/services/` or `domain/repositories/` and implement it in `infrastructure/`. That single discipline is what makes this architecture work.
