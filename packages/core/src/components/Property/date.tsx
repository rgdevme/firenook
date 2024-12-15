import { CalendarDateTime } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import dayjs from 'dayjs'

export const DateProperty = ({
	label,
	value = new Date(),
	onChange
}: {
	label: string
	value?: Date
	onChange: (val: Date) => void
}) => {
	const d = dayjs(value)

	const cdt = new CalendarDateTime(
		d.year(),
		d.month() + 1,
		d.date(),
		d.hour(),
		d.minute(),
		d.second(),
		d.millisecond()
	)

	return (
		<DatePicker
			label={label}
			hideTimeZone
			showMonthAndYearPickers
			defaultValue={cdt}
			onChange={val => {
				onChange(new Date(val.toString()))
			}}
		/>
	)
}
