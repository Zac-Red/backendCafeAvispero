import { Metadata } from "./Metadata"

export interface Paginated<T> {
  rows: T[]
  metadata: Metadata
}
