import { Text } from '@mantine/core'
import { NumberPropertySchema } from '../property'

export const NumberCell: NumberPropertySchema['cell'] = ({ row, property }) => {
	return (
		<Text size='xs' ta='right' ff='monospace' w='100%'>
			{row.getValue<string>(property.name)}
		</Text>
	)
}
