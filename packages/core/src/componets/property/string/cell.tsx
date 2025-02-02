import { Text } from '@mantine/core'
import { StringField } from '.'

export const StringCell: NonNullable<StringField['cell']> = ({
	input: { value }
}) => {
	return (
		<Text size='xs' ff='monospace' truncate='end'>
			{value}
		</Text>
	)
}
