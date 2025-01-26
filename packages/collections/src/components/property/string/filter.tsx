import { Flex, Select, Text } from '@mantine/core'
import { StringPropertySchema } from '../property'

export const StringFilter: StringPropertySchema['filter'] = ({
	fields,
	inputProps
}) => {
	return (
		<Flex
			direction='row'
			wrap='nowrap'
			align='center'
			justify='space-between'
			gap='xs'>
			<Text size='xs' pl='xs'>
				Search by
			</Text>
			<Select
				size='xs'
				data={fields.map(field => ({ label: field.label, value: field.name }))}
				comboboxProps={{ withinPortal: false }}
				{...inputProps}
			/>
		</Flex>
	)
}
