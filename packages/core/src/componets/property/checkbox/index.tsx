import { Field } from '../../../context'
import { CheckboxFilter } from './filter'
import { CheckboxInput } from './input'
import { CheckboxStatic } from './static'

export type CheckboxField = Field<
	boolean,
	typeof CheckboxStatic,
	typeof CheckboxInput,
	typeof CheckboxFilter
>
export const CheckboxField: CheckboxField = {
	type: 'checkbox',
	name: 'Checkbox',
	defaultValue: true,
	static: CheckboxStatic,
	input: CheckboxInput,
	filter: CheckboxFilter
}
