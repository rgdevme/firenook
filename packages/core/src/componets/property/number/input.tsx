import { Indicator, NumberInput as NI } from '@mantine/core'
import { FC } from 'react'
import { TbNumbers } from 'react-icons/tb'
import { FieldProps } from '../../../context'

export const NumberInput: FC<
	FieldProps<string> & {
		min?: number
		max?: number
		decimals?: undefined | number
		prefix?: string
		suffix?: string
	}
> = ({
	isDirty,
	isSubmitting,
	label,
	min,
	max,
	decimals,
	prefix,
	suffix,
	description,
	type,
	key,
	...inputProps
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<NI
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
