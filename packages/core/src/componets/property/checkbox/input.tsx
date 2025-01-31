import { Checkbox, Indicator } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const CheckboxInput: FC<FieldProps<boolean>> = ({
	isDirty,
	isSubmitting,
	label,
	description,
	checked,
	defaultValue,
	value,
	error,
	onChange,
	onFocus,
	onBlur
}) => {
	console.log({ label, checked, value, defaultValue })

	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!isDirty}
			processing={isSubmitting}>
			<Checkbox
				size='xs'
				variant='filled'
				flex='1 1 45%'
				label={label !== undefined ? label : value ? 'True' : 'False'}
				description={description}
				onChange={onChange}
				defaultChecked={defaultValue}
				checked={value}
				error={error}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</Indicator>
	)
}
