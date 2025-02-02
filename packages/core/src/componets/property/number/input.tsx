import { Indicator } from '@mantine/core'
import { NumberField } from '.'
import { NumberSchema } from './schema'

export const NumberInput: NonNullable<NumberField['input']> = ({
	status: { isDirty, isSubmitting },
	...schemaProps
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<NumberSchema {...schemaProps} />
	</Indicator>
)
