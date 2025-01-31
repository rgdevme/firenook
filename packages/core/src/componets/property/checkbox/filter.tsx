import { Checkbox, Flex, Text } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const CheckboxFilter: FC<FieldProps<boolean>> = ({
	checked,
	defaultValue,
	onChange,
	onBlur,
	label,
	onFocus
}) => {
	return (
		<Flex
			direction='row'
			wrap='nowrap'
			align='center'
			justify='space-between'
			gap='xs'>
			<Text size='xs' pl='xs'>
				{label}
			</Text>
			<Checkbox
				size='sm'
				{...{
					checked,
					defaultChecked: defaultValue,
					onBlur,
					onFocus,
					onChange
				}}
			/>
		</Flex>
	)
}
