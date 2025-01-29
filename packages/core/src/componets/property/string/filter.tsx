import { Flex, Select, Text } from '@mantine/core'
import { FC } from 'react'
import { FieldBaseProps, FieldProps } from '../../../context'

export const StringFilter: FC<
	FieldProps<string> & { fields?: FieldBaseProps[] }
> = ({ fields = [], value, defaultValue, onChange, onBlur, onFocus }) => {
	return (
		<Flex
			direction='row'
			wrap='nowrap'
			align='center'
			justify='space-between'
			gap='xs'>
			<Text size='xs' pl='xs'>
				Search by
			</Text>
			<Select
				size='xs'
				data={fields.map(field => ({
					label: field.label!,
					value: field.keyname
				}))}
				comboboxProps={{ withinPortal: false }}
				{...{ value, defaultValue, onBlur, onFocus, onChange }}
			/>
		</Flex>
	)
}
