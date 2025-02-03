import { Indicator, NumberInput as NI } from '@mantine/core'
import { NumberField } from '.'
import { TbNumbers } from 'react-icons/tb'

export const NumberInput: NonNullable<NumberField['input']> = ({
	status: { isDirty, isSubmitting },
	input,
	item: { description, label },
	options: { decimals, max, min, prefix, suffix } = {}
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<NI
			size='xs'
			variant='filled'
			flex='1 1 45%'
			label={label}
			placeholder={label}
			description={description}
			leftSection={<TbNumbers />}
			prefix={prefix}
			suffix={suffix}
			min={min}
			max={max}
			decimalScale={decimals}
			{...input}
		/>
	</Indicator>
)
