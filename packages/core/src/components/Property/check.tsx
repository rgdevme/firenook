import { Switch } from '@nextui-org/react'

export const CheckProperty = ({
	label,
	value = false,
	onChange
}: {
	label: string
	value?: boolean
	onChange: (val: boolean) => void
}) => (
	<Switch size='sm' defaultSelected={value} onValueChange={onChange}>
		{label}
	</Switch>
)
