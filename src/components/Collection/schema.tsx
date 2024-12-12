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
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure
} from '@nextui-org/react'
import { useList } from '@uidotdev/usehooks'
import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import { useCollectionsList } from '../../context/collectionsList'
import { Property, PropertyType } from '../../firebase/types/Property'
import { Item, SchemaProperty } from './property'

export const CollectionSchema = ({
	isOpen,
	onClose,
	onOpenChange
}: ReturnType<typeof useDisclosure>) => {
	const { current, updateSchema } = useCollectionsList()
	const [loading, setLoading] = useState(false)
	const [initialVal, setInitial] = useState(current?.schema!)
	const [activeId, setActiveId] = useState(null)
	const [properties, { push, updateAt, removeAt, set }] = useList<
		Property & { _id: string }
	>()

	const changed = !equals(initialVal, properties)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const onReset = () => {
		onClose()
		set(initialVal.map(x => ({ ...x, _id: crypto.randomUUID() })))
	}

	const onSubmit = async () => {
		try {
			if (!current) return
			setLoading(true)
			await updateSchema(properties.map(({ _id, ...rest }) => rest))
			onClose()
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	function handleDragEnd(event) {
		const { active, over } = event

		if (active.id !== over.id) {
			const oldIndex = properties.findIndex(p => p._id === active.id)
			const newIndex = properties.findIndex(p => p._id === over.id)
			set(arrayMove(properties, oldIndex, newIndex))
		}

		setActiveId(null)
	}

	function handleDragStart(event) {
		const { active } = event

		setActiveId(active.id)
	}

	useEffect(() => {
		if (!current) return
		setInitial(current.schema)
		set(current.schema.map(x => ({ ...x, _id: crypto.randomUUID() })))
	}, [current])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top'>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							{current?.plural} schema
						</ModalHeader>
						<ModalBody>
							<Dropdown>
								<DropdownTrigger>
									<Button variant='flat' color='primary'>
										Add field
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label='Action event example'
									onAction={key => {
										push({
											_id: crypto.randomUUID(),
											filterable: false,
											format: '',
											key: '',
											name: '',
											show: false,
											sortable: true,
											type: key as PropertyType,
											value: '',
											nullable: false,
											isArray: false
										})
									}}>
									{Object.values(PropertyType)
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
									items={properties.map(p => p._id)}
									strategy={verticalListSortingStrategy}>
									{/* <div id='create-col' className='flex flex-col gap-2'> */}
									{properties.map((p, i) => (
										<SchemaProperty
											key={p._id}
											property={p}
											onChange={upd => updateAt(i, { ...p, ...upd })}
											onRemove={() => removeAt(i)}
										/>
									))}
									{/* </div> */}
									<DragOverlay>
										{activeId && (
											<Item>
												<SchemaProperty
													property={properties.find(p => p._id === activeId)!}
													onChange={() => {}}
													onRemove={() => {}}
												/>
											</Item>
										)}
									</DragOverlay>
								</SortableContext>
							</DndContext>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onReset}>
								Close
							</Button>
							<Button
								color='primary'
								isDisabled={!changed}
								isLoading={loading}
								onPress={onSubmit}>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
