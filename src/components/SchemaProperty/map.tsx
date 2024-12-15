import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input
} from '@nextui-org/react'
import { useList } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { LuTrash } from 'react-icons/lu'
import { MdDragHandle } from 'react-icons/md'
import {
	MappedProperty,
	MappedPropertyType,
	PropertyDefaultValue
} from '../../firebase/types/Property'
import { Item } from './property'

export const MapSchemaProperty = ({
	label,
	value = [],
	onChange
}: {
	label: string
	value?: MappedProperty[]
	onChange: (val: MappedProperty[]) => void
}) => {
	const [activeId, setActiveId] = useState(null)
	const [properties, { push, updateAt, removeAt, set }] = useList(
		value.map(x => ({ ...x, id: crypto.randomUUID() }))
	)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	function handleDragEnd(event) {
		const { active, over } = event

		if (active.id !== over.id) {
			const oldIndex = properties.findIndex(p => p.id === active.id)
			const newIndex = properties.findIndex(p => p.id === over.id)
			set(arrayMove(properties, oldIndex, newIndex))
		}

		setActiveId(null)
	}

	function handleDragStart(event) {
		const { active } = event
		setActiveId(active.id)
	}

	useEffect(() => {
		onChange(properties.map(({ id, ...x }) => x))
	}, [properties])

	useEffect(() => {
		console.log(activeId)
	}, [activeId])

	return (
		<div className='flex flex-col w-full'>
			<Dropdown>
				<DropdownTrigger>
					<Button variant='flat' color='default' className='rounded-b-none'>
						Add {label} property
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label='Action event example'
					onAction={key => {
						const type = typeof PropertyDefaultValue[key]
						if (!['string', 'number', 'boolean'].includes(type)) return
						push({
							key: key as string,
							type: type as MappedProperty['type'],
							value: PropertyDefaultValue[key],
							id: crypto.randomUUID()
						})
					}}>
					{Object.values(MappedPropertyType)
						.sort((a, b) => a.localeCompare(b))
						.map(t => (
							<DropdownItem key={t} className='capitalize'>
								{t}
							</DropdownItem>
						))}
				</DropdownMenu>
			</Dropdown>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}>
				<SortableContext
					items={properties.map(p => p.id)}
					strategy={verticalListSortingStrategy}>
					<div className='flex flex-col gap-2 p-4 rounded-lg rounded-t-none border-2 border-t-0 border-dotted border-default-200'>
						{properties.length ? (
							properties.map((p, i) => (
								<MappedPropertyInput
									key={p.id}
									property={p}
									remove={() => removeAt(i)}
									update={val => updateAt(i, { ...p, key: val })}
								/>
							))
						) : (
							<div className='w-full text-center text-xs text-default-400'>
								Add some properties
							</div>
						)}
					</div>
					<DragOverlay>
						{activeId && (
							<Item>
								<MappedPropertyInput
									property={properties.find(p => p.id === activeId)!}
									remove={() => {}}
									update={() => {}}
								/>
							</Item>
						)}
					</DragOverlay>
				</SortableContext>
			</DndContext>
		</div>
	)
}

const MappedPropertyInput = ({
	property,
	remove,
	update
}: {
	property: MappedProperty & { id: string }
	remove: () => void
	update: (val: string) => void
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: property.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<Item ref={setNodeRef} style={style} {...attributes}>
			<Input
				size='sm'
				label={property.type}
				labelPlacement='outside'
				defaultValue={property.key}
				startContent={
					<MdDragHandle
						className='cursor-grab'
						onPointerDown={e => {
							e.stopPropagation()
							listeners?.onPointerDown(e)
						}}
						onKeyDown={e => {
							e.stopPropagation()
							listeners?.onKeyDown(e)
						}}
					/>
				}
				endContent={
					<Button isIconOnly size='sm' variant='light' onClick={remove}>
						<LuTrash />
					</Button>
				}
				onChange={val => update(val.target.value)}
			/>
		</Item>
	)
}
