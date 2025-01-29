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
	key,
	type,
	minLength,
	maxLength,
	suffix,
	prefix,
	description,
	...inputProps
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<TextInput
			label={label}
			placeholder={label}
			description={description}
			leftSection={prefix || <TbLetterCase />}
			rightSection={suffix}
			minLength={minLength}
			maxLength={maxLength}
			{...inputProps}
		/>
	</Indicator>
)
