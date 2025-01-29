import { Text } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const NumberStatic: FC<FieldProps<number>> = ({ value }) => {
	return (
		<Text size='xs' ta='right' ff='monospace' w='100%'>
			{value}
		</Text>
	)
}
