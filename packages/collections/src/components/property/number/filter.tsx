import { Flex, NumberInput, Text } from '@mantine/core'
import { NumberPropertySchema } from '../property'

export const NumberFilter: NumberPropertySchema['filter'] = ({
	label,
	decimals,

	minInputProps,
	maxInputProps
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
			<NumberInput
				size='xs'
				placeholder='min'
				decimalScale={decimals}
				{...minInputProps}
			/>
			<NumberInput
				size='xs'
				placeholder='max'
				decimalScale={decimals}
				{...maxInputProps}
			/>
		</Flex>
	)
}
