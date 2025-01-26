import { PropertySchema, PropertyType } from '../components/property/property'
import { CollectionSchemaProperty } from './collection'

export const getDefaultSchemaProperty = (
	side: PropertySchema['side']
): CollectionSchemaProperty => ({
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
	id: crypto.randomUUID(),
	side
})
