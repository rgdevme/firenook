import { FieldBaseProps, FieldProps } from '@firenook/core'
import { ConvertedModel, DefaultModel, FirebormStore } from 'fireborm'

/** Stored as array items in the collection.schema, each item represents
 * a property in a collection's object. */
export type CollectionSchemaProperty = Required<FieldBaseProps> &
	Required<Pick<FieldProps, 'defaultValue'>> & {
		id: ReturnType<Crypto['randomUUID']>
		side: 'left' | 'right'
		isArray?: boolean
		isNullable?: boolean
		isShown?: boolean
		isFilter?: boolean
		isSort?: boolean
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
