import { ConvertedModel, DefaultModel, FirebormStore } from 'fireborm'
import { PropertySchema } from '../components/property/property'

export type CollectionSchemaProperty = Omit<
	PropertySchema,
	'element' | 'cell' | 'filter'
> & {
	id: ReturnType<Crypto['randomUUID']>
}

export type CollectionData = {
	path: string
	singular: string
	plural: string
	customId: boolean
	schema: CollectionSchemaProperty[]
	showId: boolean
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
