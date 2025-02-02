import { Field, FieldFilterProps } from '../../../context'
import { NumberCell } from './cell'
import { NumberFilter } from './filter'
import { NumberInput } from './input'
import { NumberSchema } from './schema'

export type NumberField = typeof NumberField

export const NumberField: Field<
	number,
	{
		min?: number
		max?: number
		decimals?: number
		prefix?: string
		suffix?: string
	},
	{
		decimals?: number
		minInputProps?: FieldFilterProps<number, {}>['input']
		maxInputProps?: FieldFilterProps<number, {}>['input']
	}
> = {
	type: 'number',
	name: 'Number',
	defaultValue: 0,
	filter: NumberFilter,
	cell: NumberCell,
	input: NumberInput,
	schema: NumberSchema
} satisfies Field
