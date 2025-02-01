import { Field } from '../../../context'
import { StringStatic } from '../string/static'
import { TextAreaInput } from './input'

export type TextAreaField = Field<
	string,
	typeof StringStatic,
	typeof TextAreaInput
>
export const TextAreaField: TextAreaField = {
	type: 'textArea',
	name: 'Text area',
	defaultValue: '',
	static: StringStatic,
	input: TextAreaInput
}
