export const ApiTag = {
  SPEAKERS: 'Speakers',
  TALKS: 'Talks',
  EVENTS: 'Events',
}

export type ApiTag = (typeof ApiTag)[keyof typeof ApiTag]
