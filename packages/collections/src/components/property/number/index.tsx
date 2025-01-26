import { registerPropertySchema } from '../context'
import { NumberPropertySchema, PropertyType } from '../property'
import { NumberCell } from './cell'
import { NumberField } from './field'
import { NumberFilter } from './filter'

export const registerNumberPropertySchema = () =>
	registerPropertySchema<NumberPropertySchema>({
		type: PropertyType.NUMBER,
		defaultValue: 0,
		element: NumberField,
		filter: NumberFilter,
		cell: NumberCell
	})
