import { Indicator } from '@mantine/core'
import { CheckboxField } from '.'
import { CheckboxSchema } from './schema'

export const CheckboxInput: NonNullable<CheckboxField['input']> = ({
	status: { isDirty, isSubmitting },
	...schemaProps
}) => {
	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!isDirty}
			processing={isSubmitting}>
			<CheckboxSchema {...schemaProps} />
		</Indicator>
	)
}
