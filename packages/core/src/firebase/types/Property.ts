import { GeoPoint } from 'firebase/firestore'

export type Property = {
	key: string
	name: string
	type: PropertyType
	show: boolean
	nullable: boolean
	filterable: boolean
	sortable: boolean
	isArray: boolean
	format: string
	value: any
	computed?: string
	elements?: MappedProperty[]
}

export type MappedProperty = {
	key: string
	value: number
	type: MappedPropertyType
}

export enum MappedPropertyType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean'
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

export const PropertyDefaultValue = {
	[PropertyType.boolean]: false,
	[PropertyType.string]: '',
	[PropertyType.email]: '',
	[PropertyType.url]: '',
	[PropertyType.markdown]: '',
	[PropertyType.phone]: '',
	[PropertyType.number]: 0,
	[PropertyType.file]: [],
	[PropertyType.image]: [],
	[PropertyType.array]: [],
	[PropertyType.map]: {},
	[PropertyType.reference]: undefined,
	[PropertyType.geopoint]: new GeoPoint(0, 0),
	[PropertyType.timestamp]: new Date(),
	[PropertyType.computed]: ''
}
