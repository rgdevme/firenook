import { Flex, Select, Text } from '@mantine/core'
import { StringField } from '.'

export const StringFilter: NonNullable<StringField['filter']> = ({
	input,
	extra: { data = [] } = {}
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
				data={data}
				comboboxProps={{ withinPortal: false }}
				{...input}
			/>
		</Flex>
	)
}
