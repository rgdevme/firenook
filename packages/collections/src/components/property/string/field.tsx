import { Indicator, TextInput } from '@mantine/core'
import { TbLetterCase } from 'react-icons/tb'
import { StringPropertySchema } from '../property'

export const StringField: StringPropertySchema['element'] = ({
	dirty,
	submitting,
	label,
	inputProps,
	minLength,
	maxLength,
	suffix,
	prefix,
	description
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!dirty}
			processing={submitting}>
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
}
