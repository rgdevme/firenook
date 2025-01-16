export interface SchemaProperty {
	defaultValue: any // Depends on type
	filterable: boolean
	id: ReturnType<Crypto['randomUUID']>
	isArray: boolean
	label: string
	name: string
	nullable: boolean
	show: boolean
	side: 'left' | 'right'
	sortable: boolean
	type: string // Modify later
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
	nullable: true,
	show: true,
	sortable: true,
	type: 'string',
	id: crypto.randomUUID(),
	side
})
