import { EventEmitter } from 'events'

export type StarsEmitterMap = {
  'falling-star': [id: string]
}

export const starsEmitter = new EventEmitter<StarsEmitterMap>()
