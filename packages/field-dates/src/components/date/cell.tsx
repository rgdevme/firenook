import { Text } from '@mantine/core'
import dayjs from 'dayjs'
import { DateField } from '.'

export const DateCell: NonNullable<DateField['cell']> = ({
	input: { value }
}) => {
	return !value ? null : (
		<Text size='xs' ff='monospace' truncate='end'>
			{dayjs(value.toDate()).format('YYYY.MM.DD')}
		</Text>
	)
}
