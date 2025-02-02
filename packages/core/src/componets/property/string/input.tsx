import { Indicator } from '@mantine/core'
import { StringField } from '.'
import { StringSchema } from './schema'

export const StringInput: NonNullable<StringField['input']> = ({
	status: { isDirty, isSubmitting },
	...schemaProps
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<StringSchema {...schemaProps} />
	</Indicator>
)
