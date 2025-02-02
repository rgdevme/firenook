import { Checkbox, Flex, Text } from '@mantine/core'
import { CheckboxField } from '../../../context'

export const CheckboxFilter: NonNullable<CheckboxField['filter']> = ({
	input: { value, ...input },
	item: { label }
}) => {
	return (
		<Flex
			direction='row'
			wrap='nowrap'
			align='center'
			justify='space-between'
			gap='xs'>
			<Text size='xs' pl='xs'>
				{label}
			</Text>
			<Checkbox size='sm' {...{ checked: value, ...input }} />
		</Flex>
	)
}
