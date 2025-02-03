import { Flex, Text } from '@mantine/core'
import { DateField } from '.'
import { DateSchema } from './schema'

export const DateFilter: NonNullable<DateField['filter']> = props => {
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
			<DateSchema {...props} />
		</Flex>
	)
}
