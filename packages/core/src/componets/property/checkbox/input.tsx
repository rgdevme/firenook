import { Checkbox, Indicator, Text } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const CheckboxInput: FC<FieldProps<boolean>> = ({
	isDirty,
	isSubmitting,
	label,
	description,
	defaultValue,
	value,
	error,
	onChange,
	onFocus,
	onBlur
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!isDirty}
			processing={isSubmitting}>
			<Checkbox
				size='md'
				variant='filled'
				flex='1 1 45%'
				label={label ? <Text size='xs'>{label}</Text> : null}
				description={description}
				onChange={onChange}
				defaultChecked={defaultValue}
				checked={value}
				error={error}
				onFocus={onFocus}
				onBlur={onBlur}
				styles={{ labelWrapper: { justifyContent: 'center' } }}
			/>
		</Indicator>
	)
}
