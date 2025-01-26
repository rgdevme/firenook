import { Indicator, NumberInput } from '@mantine/core'
import { TbNumbers } from 'react-icons/tb'
import { NumberPropertySchema } from '../property'

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
}) => (
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
