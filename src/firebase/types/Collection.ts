import { ConvertedModel, DefaultModel } from 'fireborm'
import { Property } from './Property'

export type CollectionData = {
	path: string
	singular: string
	plural: string
	customId: boolean
	schema: Property[]
	defaultData: object
}

export type CollectionDoc = { collections: CollectionData[] }

export type CollectionModel = ConvertedModel<CollectionDoc>

export type CollectionDefault = DefaultModel<CollectionModel>

export type CollectionRef = CollectionModel['_ref']
