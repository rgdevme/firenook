import { Text } from '@mantine/core'
import { NumberField } from '.'

export const NumberCell: NonNullable<NumberField['cell']> = ({
	input: { value }
}) => {
	return (
		<Text size='xs' ta='right' ff='monospace'>
			{value}
		</Text>
	)
}
