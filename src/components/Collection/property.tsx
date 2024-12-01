import {
	Accordion,
	AccordionItem,
	Button,
	Chip,
	Input,
	Switch
} from '@nextui-org/react'
import { Property } from '../../firebase/types/Collection'
import { useState } from 'react'
import { BiTrash } from 'react-icons/bi'

export const SchemaProperty = ({
	property,
	onChange,
	onRemove
}: {
	property: Property
	onChange: (property: Partial<Property>) => void
	onRemove: () => void
}) => {
	const [keyByName, setKeyByName] = useState(!property.key.length)

	return (
		<Accordion isCompact variant='bordered'>
			<AccordionItem
				key='1'
				aria-label={property.name}
				title={
					<div className='flex gap-2 items-center'>
						{!property.name.length ? (
							<span className='text-sm text-zinc-500'>Name</span>
						) : (
							<span className='text-sm font-bold'>{property.name}</span>
						)}
						<Chip size='sm'>{property.type}</Chip>
						<div className='flex-1 flex justify-end'>
							<Button
								isIconOnly
								size='sm'
								variant='light'
								color='danger'
								onClick={onRemove}>
								{<BiTrash size={14} />}
							</Button>
						</div>
					</div>
				}>
				<div className='flex flex-row flex-wrap gap-2 pb-3'>
					<Input
						size='sm'
						type='text'
						label='Name'
						value={property.name}
						onChange={val => {
							const data: Partial<Property> = { name: val.target.value }
							const newKey = data.name!.toLowerCase().trim().replace(/\s/g, '_')
							if (keyByName) data.key = newKey
							else if (property.key === newKey) setKeyByName(true)
							onChange(data)
						}}
						className='flex-[1_1_40%]'
					/>

					<Input
						size='sm'
						type='text'
						label='Key'
						value={property.key}
						onChange={val => {
							const newKey = (
								val.target.value.length ? val.target.value : property.name
							)
								.toLowerCase()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, '') // remove diacritics
								.replace(/[^a-zA-Z0-9\s_]/g, '') // remove special characters
								.replace(/\s/g, '_') // convert spaces to underscores
								.replace(/_+/, '_')
							const shouldSetKeyByName = property.key === newKey
							setKeyByName(shouldSetKeyByName)
							onChange({ key: newKey })
						}}
						className='flex-[1_1_40%]'
					/>
					<Switch
						size='sm'
						className='flex-[1_1_0%] max-w-none'
						isSelected={property.nullable}
						onValueChange={val => onChange({ nullable: val })}>
						Nullable
					</Switch>
					<Switch
						size='sm'
						className='flex-[1_1_0%] max-w-none'
						isSelected={property.sortable}
						onValueChange={val => onChange({ sortable: val })}>
						Sort
					</Switch>
					<Switch
						size='sm'
						className='flex-[1_1_0%] max-w-none'
						isSelected={property.filterable}
						onValueChange={val => onChange({ filterable: val })}>
						Filter
					</Switch>
					<Switch
						size='sm'
						className='flex-[1_1_0%] max-w-none'
						isSelected={property.show}
						onValueChange={val => onChange({ show: val })}>
						Show
					</Switch>
				</div>
			</AccordionItem>
		</Accordion>
	)
}
