import { getAppState, useAppState } from '@firenook/core'
import { useMemo } from 'react'
import { CollectionData } from '../../types/collection'
import { BasePropertySchema, PropertySchema, PropertyType } from './property'
import { StringCell } from './string/cell'

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

export const registerPropertySchema = <
	T extends PropertySchema = PropertySchema
>(
	propertySchema: Partial<T> & Pick<T, 'type'>
) => {
	const properties = getPropertiesSchemas()
	const def = getDefaultPropertySchema()

	if (!properties.has(propertySchema.type)) {
		properties.set(propertySchema.type, {
			...def,
			...propertySchema
		})
	} else {
		console.error(
			`Attempt to register ${propertySchema.type} property schema failed, as property schemas cant be overwritten.`
		)
	}
}

export const getDefaultPropertySchema = (): BasePropertySchema => ({
	defaultValue: '',
	filterable: false,
	isArray: false,
	label: '',
	name: '',
	description: '',
	nullable: true,
	show: true,
	sortable: true,
	type: PropertyType.STRING,
	side: 'left',
	element: () => null,
	cell: StringCell,
	filter: () => null
})

export const getDocumentDefaultValues = (
	collection: CollectionData
): Record<string, any> =>
	Object.fromEntries(
		collection.schema.map(prop => [prop.name, prop.defaultValue])
	)
