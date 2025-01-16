import { ConvertedModel, DefaultModel, FirebormStore } from 'fireborm'
import { SchemaProperty } from './schema'

export type CollectionData = {
	path: string
	singular: string
	plural: string
	customId: boolean
	schema: SchemaProperty[]
	defaultData: object
}

export type CollectionDoc = { [col_id: string]: CollectionData }

export type CollectionModel = ConvertedModel<CollectionDoc>

export type CollectionDefault = DefaultModel<CollectionModel>

export type CollectionRef = CollectionModel['_ref']

export type CollectionStore = FirebormStore<
	CollectionDoc,
	CollectionModel,
	CollectionDefault,
	CollectionDefault
>
