import { Text } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const StringStatic: FC<FieldProps<string>> = ({ value }) => {
	return (
		<Text size='xs' ff='monospace' w='100%'>
			{value}
		</Text>
	)
}
