export type Property = {
	key: string
	name: string
	type: PropertyType
	show: boolean
	nullable: boolean
	filterable: boolean
	sortable: boolean
	format: string
	value: any
	computed?: string
	elements?: Property[]
}

export enum PropertyType {
	boolean = 'boolean',
	computed = 'computed',
	email = 'email',
	geopoint = 'geopoint',
	map = 'map',
	array = 'array',
	markdown = 'markdown',
	number = 'number',
	phone = 'phone',
	reference = 'reference',
	string = 'string',
	timestamp = 'timestamp',
	url = 'url',
	image = 'image',
	file = 'file'
}
