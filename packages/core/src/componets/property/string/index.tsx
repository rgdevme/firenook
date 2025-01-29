import { Field } from '../../../context'
import { StringFilter } from './filter'
import { StringInput } from './input'
import { StringStatic } from './static'

export type StringField = Field<
	string,
	typeof StringStatic,
	typeof StringInput,
	typeof StringFilter
>
export const StringField: StringField = {
	type: 'string',
	defaultValue: '',
	static: StringStatic,
	input: StringInput,
	filter: StringFilter
}
