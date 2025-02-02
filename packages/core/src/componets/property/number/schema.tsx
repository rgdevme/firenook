import { NumberInput as NI } from '@mantine/core'
import { TbNumbers } from 'react-icons/tb'
import { NumberField } from '.'

export const NumberSchema: NonNullable<NumberField['schema']> = ({
	input,
	options: { decimals, max, min, prefix, suffix } = {}
}) => (
	<NI
		size='xs'
		variant='filled'
		flex='1 1 45%'
		placeholder='0'
		leftSection={<TbNumbers />}
		prefix={prefix}
		suffix={suffix}
		min={min}
		max={max}
		decimalScale={decimals}
		{...input}
	/>
)
