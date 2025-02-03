import { Indicator, TextInput } from '@mantine/core'
import { TbLetterCase } from 'react-icons/tb'
import { StringField } from '.'

export const StringInput: NonNullable<StringField['input']> = ({
	status: { isDirty, isSubmitting },
	input,
	item: { label, description },
	options: { maxLength, minLength, prefix, suffix } = {}
}) => {
	console.log(input.value)
	return (
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
				{...input}
				onChange={val => {
					input.onChange(val.target.value)
				}}
			/>
		</Indicator>
	)
}
