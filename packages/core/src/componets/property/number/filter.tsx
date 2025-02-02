import { Flex, NumberInput, Text } from '@mantine/core'
import { NumberField } from '.'

export const NumberFilter: NonNullable<NumberField['filter']> = ({
	item: { label },
	extra: { maxInputProps, minInputProps, decimals } = {}
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
