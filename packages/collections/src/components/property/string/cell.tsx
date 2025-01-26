import { Text } from '@mantine/core'
import { StringPropertySchema } from '../property'

export const StringCell: StringPropertySchema['cell'] = ({ row, property }) => {
	return (
		<Text size='xs' ff='monospace' w='100%'>
			{row.getValue<string>(property.name)}
		</Text>
	)
}
