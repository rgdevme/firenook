import { Text } from '@mantine/core'
import { GeoPoint } from 'firebase/firestore'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const GeoPointStatic: FC<FieldProps<GeoPoint>> = ({ value }) => {
	return (
		<Text size='xs' ta='right' ff='monospace'>
			{`${value?.latitude} ${value?.longitude}`}
		</Text>
	)
}
