import { Checkbox, Text } from '@mantine/core'
import { CheckboxField } from '.'

export const CheckboxSchema: NonNullable<CheckboxField['schema']> = ({
	input: { value, ...input },
	item: { description, label }
}) => {
	return (
		<Checkbox
			size='md'
			variant='filled'
			flex='1 1 45%'
			label={label ? <Text size='xs'>{label}</Text> : null}
			description={description}
			{...input}
			checked={value}
			styles={{ labelWrapper: { justifyContent: 'center' } }}
		/>
	)
}
