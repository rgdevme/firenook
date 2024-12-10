import { ConvertedModel, DefaultModel } from 'fireborm'

export type BucketData = { name: string; path: string }

export type BucketDoc = { buckets: BucketData[] }

export type BucketModel = ConvertedModel<BucketDoc>

export type BucketDefault = DefaultModel<BucketModel>

export type BucketRef = BucketModel['_ref']
