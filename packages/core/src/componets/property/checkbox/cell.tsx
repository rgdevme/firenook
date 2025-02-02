import { Checkbox } from '@mantine/core'
import { CheckboxField } from '.'

export const CheckboxCell: CheckboxField['cell'] = ({ input: { value } }) => {
	return <Checkbox defaultChecked={value} size='sm' />
}
