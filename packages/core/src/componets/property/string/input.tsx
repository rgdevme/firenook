import { Indicator, TextInput } from '@mantine/core'
import { FC } from 'react'
import { TbLetterCase } from 'react-icons/tb'
import { FieldProps } from '../../../context'

export const StringInput: FC<
	FieldProps<string> & {
		minLength?: number
		maxLength?: number
		suffix?: string
		prefix?: string
	}
> = ({
	isDirty,
	isSubmitting,
	label,
	minLength,
	maxLength,
	suffix,
	prefix,
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
		<TextInput
			size='xs'
			variant='filled'
			flex='1 1 45%'
			label={label}
			placeholder={label}
			description={description}
			leftSection={prefix || <TbLetterCase />}
			rightSection={suffix}
			minLength={minLength}
			maxLength={maxLength}
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			checked={checked}
			error={error}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	</Indicator>
)
