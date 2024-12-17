import { Input } from '@nextui-org/react'
import { useState } from 'react'
import { z, ZodSchema } from 'zod'
import { PropertyType } from '../../types'

export const StringProperty = ({
	type,
	label,
	value = '',
	onChange
}: {
	type: PropertyType
	label: string
	value?: string
	onChange: (val: string) => void
}) => {
	const [isInvalid, setInvalid] = useState(false)

	let validate = () => {
		let schema: ZodSchema

		switch (type) {
			case PropertyType.email:
				schema = z.string().email()
				break
			case PropertyType.url:
				schema = z.string().url()
				break

			case PropertyType.url:
			default:
				schema = z.string()
				break
		}

		setInvalid(!schema.safeParse(value).success)
	}

	return (
		<Input
			size='sm'
			isInvalid={isInvalid}
			color={isInvalid ? 'danger' : 'default'}
			label={label}
			defaultValue={value}
			onChange={val => onChange(val.target.value)}
			onBlur={validate}
		/>
	)
}
