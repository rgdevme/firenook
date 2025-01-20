import { getAppState, useAppState } from '@firenook/core'
import { PropertySchema } from './property'
import { CollectionData } from '../../types/collection'
import { useMemo } from 'react'

const getPropertiesSchemas = () =>
	getAppState<Map<string, PropertySchema>>('property_schema').get()

export const usePropertiesSchemas = (
	collection: CollectionData | undefined
): PropertySchema[] => {
	const [properties] =
		useAppState<Map<string, PropertySchema>>('property_schema')

	return useMemo(
		() =>
			(collection?.schema ?? []).map(col_schema => {
				const { element, filter, cell } = properties.get(col_schema.type)!
				return {
					...col_schema,
					element,
					filter,
					cell
				} as PropertySchema
			}),
		[properties, collection]
	)
}

export const getPropertySchema = (name: string) => {
	const properties = getPropertiesSchemas()
	if (properties.has(name)) return properties.get(name)!
	console.error(`Property schema ${name} hasn't been set.`)
	return
}

export const registerPropertySchema = (
	propertySchema: Omit<PropertySchema, 'id'>
) => {
	const properties = getPropertiesSchemas()

	if (!properties.has(propertySchema.type)) {
		properties.set(propertySchema.type, propertySchema as PropertySchema)
	} else {
		console.error(
			`Attempt to register ${propertySchema.type} property schema failed, as property schemas cant be overwritten.`
		)
	}
}
