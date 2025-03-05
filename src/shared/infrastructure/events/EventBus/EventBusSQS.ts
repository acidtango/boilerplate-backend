import {
  CreateQueueCommand,
  GetQueueAttributesCommand,
  ListQueuesCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs'
import type { interfaces } from 'inversify'
import { Consumer } from 'sqs-consumer'
import type { DomainEvent } from '../../../domain/events/DomainEvent.ts'
import type { EventBus } from '../../../domain/models/hex/EventBus.ts'
import { Token } from '../../../domain/services/Token.ts'
import type { Closable } from '../../repositories/Closable.ts'
import type { Reseteable } from '../../repositories/Reseteable.js'
import type { DomainEventNotifier } from '../DomainEventMapper/DomainEventNotifier.js'

export type SQSConfig = {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
  endpoint?: string
  sqs: {
    url: string
  }
}

export class EventBusSQS implements EventBus, Closable, Reseteable {
  private queueUrl: string

  private readonly notifier: DomainEventNotifier

  private readonly client: SQSClient

  private consumer?: Consumer

  public static async create({ container }: interfaces.Context) {
    return new EventBusSQS(
      container.get<SQSConfig>(Token.SQS_CONFIG),
      await container.getAsync<DomainEventNotifier>(Token.DOMAIN_EVENT_NOTIFIER),
    )
  }

  public static async onActivation(_: interfaces.Context, eventBus: EventBusSQS) {
    await eventBus.initialize()
    return eventBus
  }

  constructor(config: SQSConfig, notifier: DomainEventNotifier) {
    this.client = new SQSClient({
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
      region: config.region,
      endpoint: config.endpoint,
    })
    this.queueUrl = config.sqs.url
    this.notifier = notifier
  }

  async close(): Promise<void> {
    await this.waitForProcessingAllEvents()
    this.consumer?.stop()
    this.client.destroy()
  }

  async initialize() {
    this.queueUrl = await this.getOrCreateQueue()
    this.consumer = Consumer.create({
      sqs: this.client,
      queueUrl: this.queueUrl,
      alwaysAcknowledge: true,
      handleMessage: async ({ Body }) => {
        if (!Body) return
        await this.notifier.handle(JSON.parse(Body))
      },
      waitTimeSeconds: 0,
    })
    this.consumer.start()
  }

  async reset(): Promise<void> {
    await this.waitForProcessingAllEvents()
  }

  public async waitForProcessingAllEvents() {
    while (await this.arePendingEvents()) {}
  }

  async createQueue(name: string): Promise<string> {
    const createQueueCommand = new CreateQueueCommand({ QueueName: name })
    const { QueueUrl } = await this.client.send(createQueueCommand)

    if (!QueueUrl) {
      throw new Error('Could not create queue')
    }

    return QueueUrl
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const command = new SendMessageCommand({
        MessageBody: JSON.stringify(event.toPrimitives()),
        QueueUrl: this.queueUrl,
        MessageAttributes: {
          id: { DataType: 'String', StringValue: event.eventId.toPrimitives() },
          executor_id: { DataType: 'String', StringValue: 'TODO' },
          type: { DataType: 'String', StringValue: event.code },
          occurred_at: { DataType: 'String', StringValue: event.occurredAt.toString() },
        },
      })
      await this.client.send(command)
    }
  }

  async listQueues(): Promise<string[]> {
    const response = await this.client.send(new ListQueuesCommand())
    return response.QueueUrls ?? []
  }

  async getOrCreateQueue() {
    const queues = await this.listQueues()
    const queueName = this.queueUrl.split('/').pop()

    if (!queueName) {
      throw new Error(`Invalid queue URL ${this.queueUrl}`)
    }

    const url = queues.find((queue) => queue.match(queueName))

    if (!url) {
      return await this.createQueue(queueName)
    }

    return url
  }

  async countPendingMessages() {
    const { Attributes } = await this.client.send(
      new GetQueueAttributesCommand({
        QueueUrl: this.queueUrl,
        AttributeNames: ['ApproximateNumberOfMessages'],
      }),
    )
    return Number(Attributes?.ApproximateNumberOfMessages ?? '0')
  }

  async arePendingEvents(): Promise<boolean> {
    const pendingMessages = await this.countPendingMessages()
    return pendingMessages > 0
  }
}
