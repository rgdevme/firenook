import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	Accordion,
	AccordionItem,
	Button,
	Chip,
	Input,
	Switch
} from '@nextui-org/react'
import { forwardRef, PropsWithChildren, useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { MdDragHandle } from 'react-icons/md'
import { MapSchemaProperty } from './map'
import { Property, PropertyType } from '../../plugins/store/type'

export const Item = forwardRef<HTMLDivElement, PropsWithChildren<any>>(
	(props, ref) => (
		<div {...props} ref={ref} className='aria-pressed:opacity-0 opacity-100' />
	)
)

export const SchemaProperty = ({
	property,
	onChange,
	onRemove
}: {
	property: Property & { _id: string }
	onChange: (property: Partial<Property & { _id: string }>) => void
	onRemove: () => void
}) => {
	const [keyByName, setKeyByName] = useState(!property.key.length)
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: property._id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<Item ref={setNodeRef} style={style} {...attributes}>
			<Accordion isCompact variant='bordered' className='bg-white'>
				<AccordionItem
					key='1'
					startContent={
						<MdDragHandle
							onPointerDown={e => {
								e.stopPropagation()
								listeners?.onPointerDown(e)
							}}
							onKeyDown={e => {
								e.stopPropagation()
								listeners?.onKeyDown(e)
							}}
							className='cursor-grab'
						/>
					}
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
								const newKey = data
									.name!.toLowerCase()
									.trim()
									.replace(/\s/g, '_')
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
							defaultSelected={property.nullable}
							onValueChange={val => onChange({ nullable: val })}>
							Nullable
						</Switch>
						<Switch
							size='sm'
							className='flex-[1_1_0%] max-w-none'
							defaultSelected={property.sortable}
							onValueChange={val => onChange({ sortable: val })}>
							Sort
						</Switch>
						<Switch
							size='sm'
							className='flex-[1_1_0%] max-w-none'
							defaultSelected={property.filterable}
							onValueChange={val => onChange({ filterable: val })}>
							Filter
						</Switch>
						<Switch
							size='sm'
							className='flex-[1_1_0%] max-w-none'
							defaultSelected={property.show}
							onValueChange={val => onChange({ show: val })}>
							Show
						</Switch>
						<Switch
							size='sm'
							className='flex-[1_1_0%] max-w-none'
							defaultSelected={property.isArray}
							onValueChange={val => onChange({ isArray: val })}>
							Array
						</Switch>

						{property.type === PropertyType.map && (
							<MapSchemaProperty
								label={property.key}
								value={property.elements}
								onChange={val => onChange({ elements: val })}
							/>
						)}
					</div>
				</AccordionItem>
			</Accordion>
		</Item>
	)
}
