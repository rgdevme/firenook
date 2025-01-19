import { PropertySchema } from '../components/property/property'

export interface SchemaProperty extends Omit<PropertySchema, 'element'> {
	id: ReturnType<Crypto['randomUUID']>
}

export interface ComputedSchemaProperty extends SchemaProperty {
	type: 'computed'
	nullable: true
	computed?: string
}

export const getDefaultSchemaProperty = (
	side: SchemaProperty['side']
): SchemaProperty => ({
	defaultValue: '',
	filterable: false,
	isArray: false,
	label: '',
	name: '',
	description: '',
	nullable: true,
	show: true,
	sortable: true,
	type: 'string',
	id: crypto.randomUUID(),
	side
})
