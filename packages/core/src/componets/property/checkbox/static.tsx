import { Checkbox } from '@mantine/core'
import { FC } from 'react'
import { FieldProps } from '../../../context'

export const CheckboxStatic: FC<FieldProps<boolean>> = ({ value }) => {
	return <Checkbox checked={value} size='sm' />
}
