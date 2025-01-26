import { registerPropertySchema } from '../context'
import { PropertyType, StringPropertySchema } from '../property'
import { StringCell } from './cell'
import { StringField } from './field'
import { StringFilter } from './filter'

export const registerStringPropertySchema = () =>
	registerPropertySchema<StringPropertySchema>({
		type: PropertyType.STRING,
		element: StringField,
		filter: StringFilter,
		cell: StringCell
	})
