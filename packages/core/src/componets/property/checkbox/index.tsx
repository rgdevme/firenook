import { Field } from '../../../context'
import { CheckboxCell } from './cell'
import { CheckboxFilter } from './filter'
import { CheckboxInput } from './input'
import { CheckboxSchema } from './schema'

export type CheckboxField = typeof CheckboxField

export const CheckboxField: Field<boolean> = {
	type: 'checkbox',
	name: 'Checkbox',
	defaultValue: true,
	cell: CheckboxCell,
	input: CheckboxInput,
	filter: CheckboxFilter,
	schema: CheckboxSchema
}
