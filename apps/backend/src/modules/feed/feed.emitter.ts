import { EventEmitter } from 'events'

export type FeedEmitterMap = {
  'falling-star': [id: string]
}

export const feedEmitter = new EventEmitter<FeedEmitterMap>()
