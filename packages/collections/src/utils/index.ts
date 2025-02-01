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
