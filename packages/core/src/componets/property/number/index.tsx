import { Field } from '../../../context'
import { NumberFilter } from './filter'
import { NumberInput } from './input'
import { NumberStatic } from './static'

export type NumberField = Field<
	number,
	typeof NumberStatic,
	typeof NumberInput,
	typeof NumberFilter
>
export const NumberField: NumberField = {
	type: 'number',
	defaultValue: 0,
	filter: NumberFilter,
	static: NumberStatic,
	input: NumberInput
} satisfies Field
