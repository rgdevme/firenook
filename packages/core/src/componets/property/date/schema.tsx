import { DatePickerInput, DatesProvider } from '@mantine/dates'
import { TbCalendar } from 'react-icons/tb'
import { DateField } from '.'
import { Timestamp } from 'firebase/firestore'

export const DateSchema: NonNullable<DateField['schema']> = ({
	input,
	options: { min, max } = {}
}) => (
	<DatesProvider settings={{ consistentWeeks: true }}>
		<DatePickerInput
			ff='monospace'
			size='xs'
			flex='1 1 45%'
			popoverProps={{ styles: { dropdown: { fontFamily: 'monospace' } } }}
			styles={{ input: { fontSize: 'var(--mantine-font-size-xs)' } }}
			valueFormat='YYYY.MM.DD'
			leftSection={<TbCalendar />}
			leftSectionPointerEvents='none'
			variant='filled'
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
)
