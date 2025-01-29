import { Flex, NumberInput, Text } from '@mantine/core'
import { FC } from 'react'
import { FieldBaseProps, FieldInputProps } from '../../../context'

export const NumberFilter: FC<
	FieldBaseProps & {
		fields?: any[]
		decimals?: number
		minInputProps: FieldInputProps<number>
		maxInputProps: FieldInputProps<number>
	}
> = ({ label, decimals, minInputProps, maxInputProps }) => {
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
