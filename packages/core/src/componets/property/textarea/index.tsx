import { Field } from '../../../context'
import { StringCell } from '../string/cell'
import { StringSchema } from '../string/schema'
import { TextAreaInput } from './input'

export type TextAreaField = typeof TextAreaField
export const TextAreaField: Field<
	string,
	{
		minLength?: number
		maxLength?: number
	}
> = {
	type: 'textArea',
	name: 'Text area',
	defaultValue: '',
	cell: StringCell,
	input: TextAreaInput,
	schema: StringSchema
}
