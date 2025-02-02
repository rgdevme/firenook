import { ComboboxData } from '@mantine/core'
import { Field } from '../../../context'
import { StringCell } from './cell'
import { StringFilter } from './filter'
import { StringInput } from './input'
import { StringSchema } from './schema'

export type StringField = typeof StringField

export const StringField: Field<
	string,
	{
		minLength?: number
		maxLength?: number
		suffix?: string
		prefix?: string
	},
	{ data?: ComboboxData }
> = {
	type: 'string',
	name: 'Text',
	defaultValue: '',
	cell: StringCell,
	input: StringInput,
	filter: StringFilter,
	schema: StringSchema
}
