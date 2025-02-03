import { Timestamp } from 'firebase/firestore'
import { Field } from '../../../context'
import { DateCell } from './cell'
import { DateFilter } from './filter'
import { DateInput } from './input'
import { DateSchema } from './schema'

export type DateField = typeof DateField

export const DateField: Field<
	Timestamp,
	{
		min?: Date
		max?: Date
	}
> = {
	type: 'date',
	name: 'Date',
	defaultValue: Timestamp.fromDate(new Date()),
	cell: DateCell,
	input: DateInput,
	filter: DateFilter,
	schema: DateSchema
}
