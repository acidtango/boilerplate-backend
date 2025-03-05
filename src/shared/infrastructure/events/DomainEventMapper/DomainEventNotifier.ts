export interface DomainEventNotifier {
  handle(primitives: unknown): Promise<void>
}
