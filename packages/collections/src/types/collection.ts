import { FieldSchemaProps } from '@firenook/core'
import { ConvertedModel, DefaultModel, FirebormStore } from 'fireborm'

type GenericFieldSchema = FieldSchemaProps<
	any,
	any,
	{
		id: ReturnType<Crypto['randomUUID']>
		side: 'left' | 'right'
		isArray?: boolean
		isNullable?: boolean
		isShown?: boolean
		isFilter?: boolean
		isSort?: boolean
	}
>

/** Stored as array items in the collection.schema, each item represents
 * a property in a collection's object. */
export type CollectionSchemaProperty = {
	input: Pick<GenericFieldSchema['input'], 'value'>
} & Omit<GenericFieldSchema, 'input'>
export type CollectionSchemaForm = Required<GenericFieldSchema['extra']> &
	Required<Pick<GenericFieldSchema['input'], 'value'>> &
	Required<GenericFieldSchema['item']> &
	Required<GenericFieldSchema['options']>

export type CollectionData = {
	path: string
	singular: string
	plural: string
	customId: boolean
	schema: CollectionSchemaForm[]
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
