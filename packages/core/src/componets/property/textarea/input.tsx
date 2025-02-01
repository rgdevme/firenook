import { Indicator, Textarea } from '@mantine/core'
import { FC } from 'react'
import { TbTextSize } from 'react-icons/tb'
import { FieldProps } from '../../../context'

export const TextAreaInput: FC<
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
		<Textarea
			size='xs'
			variant='filled'
			flex='1 1 45%'
			label={label}
			minRows={!label ? 1 : 3}
			resize={label ? 'vertical' : undefined}
			autosize
			placeholder={label}
			description={description}
			leftSection={prefix || <TbTextSize />}
			rightSection={suffix}
			minLength={minLength}
			maxLength={maxLength}
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			error={error}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	</Indicator>
)
