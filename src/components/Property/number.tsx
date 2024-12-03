import { Input } from '@nextui-org/react'
import { useState } from 'react'
import { z } from 'zod'

export const NumberProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value: string
	onChange: (val: string) => void
}) => {
	const [isInvalid, setInvalid] = useState(false)

	let validate = () => {
		let schema = z.number().finite().safe()

		setInvalid(!schema.safeParse(value).success)
	}

	return (
		<Input
			size='sm'
			type='number'
			isInvalid={isInvalid}
			color={isInvalid ? 'danger' : 'default'}
			label={label}
			value={value}
			onChange={val => onChange(val.target.value)}
			onBlur={validate}
		/>
	)
}
