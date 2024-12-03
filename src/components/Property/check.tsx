import { Switch } from '@nextui-org/react'

export const CheckProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value: boolean
	onChange: (val: boolean) => void
}) => (
	<Switch size='sm' isSelected={value} onValueChange={onChange}>
		{label}
	</Switch>
)
