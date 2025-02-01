import { FieldsContext } from '@firenook/core'

export const getPath = (singular: string) =>
	singular.toLowerCase().replace(/ +/g, '_')

export const getPlural = (singular: string) =>
	!singular.length ? '' : singular + 's'

export const examples = [
	'Post',
	'Student',
	'Tag',
	'Hat',
	'Body part',
	'Dog',
	'User',
	'Friend'
].map(x => [x, getPlural(x), getPath(x)])

export const getFiledTypes = (fieldsContext: FieldsContext) =>
	fieldsContext
		.values()
		.toArray()
		.map(f => ({
			label: f.name,
			value: f.type
		}))
