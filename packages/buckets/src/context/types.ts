import { ConvertedModel, DefaultModel, FirebormStore } from 'fireborm'

export type BucketData = { name: string; bucket: string | null; path: string }

export type BucketDoc = { [key: string]: BucketData }

export type BucketModel = ConvertedModel<BucketDoc>

export type BucketDefault = DefaultModel<BucketModel>

export type BucketRef = BucketModel['_ref']

export type BucketStore = FirebormStore<
	BucketDoc,
	BucketModel,
	BucketDefault,
	BucketDefault
>
