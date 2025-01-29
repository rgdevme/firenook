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
	defaultValue,
	value,
	checked,
	error,
	onChange,
	onFocus,
	onBlur
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
			defaultValue={defaultValue}
			value={value}
			checked={checked}
			error={error}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	</Indicator>
)
