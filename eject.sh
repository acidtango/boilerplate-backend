#!/usr/bin/env bash

rm -rf src/events
rm -rf src/speakers
rm -rf src/talks

rm -rf test/api/events
rm -rf test/api/speakers
rm -rf test/api/talks

rm -rf test/fakes/EventRepositoryFake.ts
rm -rf test/fakes/SpeakerRepositoryFake.ts
rm -rf test/fakes/TalkRepositoryFake.ts

rm -rf test/mother/EventMother
rm -rf test/mother/SpeakerMother
rm -rf test/mother/TalkMother

sed -i '' '1,10d' src/shared/domain/services/EmailSender.ts
sed -i '' '2,2d' src/shared/domain/services/EmailSender.ts
sed -i '' '1i\
// biome-ignore lint/suspicious/noEmptyInterface: Placeholder
' src/shared/domain/services/EmailSender.ts

sed -i '' '4,4d' test/fakes/EmailSenderFake.ts
sed -i '' '8,16d' test/fakes/EmailSenderFake.ts
sed -i '' '10,10d' test/fakes/EmailSenderFake.ts

sed -i '' '1s/^\(.\{25\}\).\{22\}/\1/' src/shared/infrastructure/email/EmailSenderNoop.ts
sed -i '' '4,4d' src/shared/infrastructure/email/EmailSenderNoop.ts

sed -i '' '2,2d' test/setups/container.ts
sed -i '' '6,7d' test/setups/container.ts
sed -i '' '16,18d' test/setups/container.ts

sed -i '' '2,6d' src/container.ts
sed -i '' '14,32d' src/container.ts
sed -i '' '18,29d' src/container.ts
sed -i '' '20,29d' src/container.ts
sed -i '' '22,22d' src/container.ts
sed -i '' '24,26d' src/container.ts

sed -i '' '47,161d' test/utils/TestClient.ts
sed -i '' '20,27d' test/utils/TestClientUtils.ts

sed -i '' '3,15d' src/shared/domain/errors/DomainErrorCode.ts

sed -i '' '2,5d' src/shared/domain/events/DomainEventCode.ts
sed -i '' '14,26d' src/shared/infrastructure/errors/domainErrorToHttpStatusCode.ts

sed -i '' '20i\
container.bind(Token.ENDPOINT).toConstantValue({\
    method: "get" as const,\
    path: "/hello-world",\
    handlers: factory.createHandlers((c) => c.json(null, 200)),\
})
' src/container.ts

sed -i '' '14i\
import { factory } from "./shared/infrastructure/controllers/factory.ts";
' src/container.ts

node --run check:fix
