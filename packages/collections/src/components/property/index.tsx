import { Indicator, NumberInput, TextInput } from '@mantine/core'
import { TbLetterCase, TbNumbers } from 'react-icons/tb'
// import { registerPropertySchema } from './context'
import { NumberPropertySchema, StringPropertySchema } from './property'

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

export const NumberField: NumberPropertySchema['element'] = ({
	dirty,
	submitting,
	label,
	inputProps,
	min,
	max,
	decimals,
	prefix,
	suffix,
	description
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!dirty}
			processing={submitting}>
			<NumberInput
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
}
