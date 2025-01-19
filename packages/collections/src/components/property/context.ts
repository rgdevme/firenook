import { getAppState, useAppState } from '@firenook/core'
import { PropertySchema } from './property'

const getPropertiesSchemas = () =>
	getAppState<Map<string, PropertySchema>>('property_schema').get()

export const usePropertiesSchemas = () =>
	useAppState<Map<string, PropertySchema>>('property_schema')

export const getPropertySchema = (name: string) => {
	const properties = getPropertiesSchemas()
	if (properties.has(name)) return properties.get(name)!
	console.error(`Property schema ${name} hasn't been set.`)
	return
}

export const registerPropertySchema = <
	T extends Omit<PropertySchema, 'id' | 'type'> = PropertySchema
>(
	type: string,
	propertySchema: T
) => {
	const properties = getPropertiesSchemas()

	if (!properties.has(type)) {
		properties.set(type, { ...propertySchema, type: type })
	} else {
		console.error(
			`Attempt to register ${type} property schema failed, as property schemas cant be overwritten.`
		)
	}
}
