import { Indicator } from '@mantine/core'
import { DatePickerInput, DatesProvider } from '@mantine/dates'
import { TbCalendar } from 'react-icons/tb'
import { DateField } from '.'
import { Timestamp } from 'firebase/firestore'

export const DateInput: NonNullable<DateField['input']> = ({
	status: { isDirty, isSubmitting },
	item: { description, label },
	input,
	options: { max, min } = {}
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!isDirty}
			processing={isSubmitting}>
			<DatesProvider settings={{ consistentWeeks: true }}>
				<DatePickerInput
					ff='monospace'
					size='xs'
					leftSection={<TbCalendar />}
					leftSectionPointerEvents='none'
					variant='filled'
					valueFormat='YYYY.MM.DD'
					label={label}
					description={description}
					placeholder='Pick date'
					maxDate={max}
					minDate={min}
					{...input}
					onChange={val =>
						val && input.onChange(Timestamp.fromMillis(val?.valueOf()))
					}
					value={input.value?.toDate()}
				/>
			</DatesProvider>
		</Indicator>
	)
}
