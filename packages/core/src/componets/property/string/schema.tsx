import { TextInput } from '@mantine/core'
import { TbLetterCase } from 'react-icons/tb'
import { StringField } from '.'

export const StringSchema: NonNullable<StringField['schema']> = ({
	input,
	options: { maxLength, minLength, prefix, suffix } = {}
}) => (
	<TextInput
		size='xs'
		variant='filled'
		flex='1 1 45%'
		placeholder='Add some text'
		leftSection={prefix || <TbLetterCase />}
		rightSection={suffix}
		minLength={minLength}
		maxLength={maxLength}
		{...input}
	/>
)
