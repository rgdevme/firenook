import { Indicator, Textarea } from '@mantine/core'
import { TextAreaField } from '.'

export const TextAreaInput: TextAreaField['input'] = ({
	item: { description, label },
	input,
	status: { isDirty, isSubmitting },
	options: { maxLength, minLength } = {}
}) => (
	<Indicator
		position='top-end'
		size={12}
		withBorder
		disabled={!isDirty}
		processing={isSubmitting}>
		<Textarea
			size='xs'
			variant='filled'
			flex='1 1 45%'
			label={label}
			minRows={!label ? 1 : 3}
			resize={label ? 'vertical' : undefined}
			autosize
			placeholder={label}
			description={description}
			minLength={minLength}
			maxLength={maxLength}
			{...input}
		/>
	</Indicator>
)
