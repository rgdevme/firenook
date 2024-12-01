import { ConvertedModel, DefaultModel } from 'fireborm'
import { Property } from './Property'

export type CollectionDoc = {
	path: string
	singular: string
	plural: string
	customId: boolean
	schema: Property[]
}

export type CollectionModel = ConvertedModel<
	CollectionDoc & { defaultData: object }
>

export type CollectionDefault = DefaultModel<CollectionModel>

export type CollectionRef = CollectionModel['_ref']
