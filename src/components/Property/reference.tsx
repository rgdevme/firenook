import { Select, SelectItem } from '@nextui-org/react'
import { DocumentReference } from 'firebase/firestore'
import { useState } from 'react'

export const ReferenceProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value?: DocumentReference
	onChange: (val: DocumentReference) => void
}) => {
	const [selected, setSelected] = useState(new Set<string>())
	const data: any[] = []

	return (
		<Select
			size='sm'
			label={label}
			selectedKeys={selected}
			className='max-w-xs'
			onSelectionChange={val => {
				if (val === 'all') {
					setSelected(new Set(data.map(d => d.id)))
				} else setSelected(val as Set<string>)
			}}
			// onBlur={validate}
		>
			{data.map(animal => (
				<SelectItem key={animal.key}>{animal.label}</SelectItem>
			))}
		</Select>
	)
}
