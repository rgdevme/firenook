import { Flex, Indicator, NumberInput, Text } from '@mantine/core'
import { TbNumbers } from 'react-icons/tb'
import { NumberPropertySchema } from './property'

export const NumberField: NumberPropertySchema['element'] = ({
	dirty,
	submitting,
	label,
	inputProps,
	min,
	max,
	decimals,
	prefix,
	suffix,
	description
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!dirty}
			processing={submitting}>
			<NumberInput
				label={label}
				placeholder={label}
				description={description}
				leftSection={<TbNumbers />}
				prefix={prefix}
				suffix={suffix}
				min={min}
				max={max}
				decimalScale={decimals}
				{...inputProps}
			/>
		</Indicator>
	)
}

export const StringFilter: NumberPropertySchema['filter'] = ({
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
