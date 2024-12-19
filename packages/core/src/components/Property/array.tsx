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
import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { useList } from '@uidotdev/usehooks'
import {
	FunctionComponent,
	PropsWithChildren,
	useEffect,
	useState
} from 'react'
import { LuTrash } from 'react-icons/lu'
import { MdDragHandle } from 'react-icons/md'
import { PropertyDefaultValue, PropertyProps } from '../../types'

export const ArrayProperty = ({
	label,
	value: values = [],
	type,
	onChange,
	element: El,
	schema
}: PropertyProps<any[]> & {
	element: FunctionComponent<PropertyProps>
}) => {
	const [activeId, setActiveId] = useState(null)
	const [array, { push, updateAt, removeAt, set }] = useList<
		Omit<PropertyProps, 'onChange'> & { _id: string }
	>(
		values.map((value, i) => ({
			value,
			type,
			_id: crypto.randomUUID(),
			label: `${label} [${i + 1}]`
		}))
	)

	const pointerSensor = useSensor(PointerSensor)
	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates
	})
	const sensors = useSensors(pointerSensor, keyboardSensor)

	function handleDragEnd(event) {
		const { active, over } = event

		if (active.id !== over.id) {
			const oldIndex = array.findIndex(p => p._id === active.id)
			const newIndex = array.findIndex(p => p._id === over.id)
			set(arrayMove(array, oldIndex, newIndex))
		}

		setActiveId(null)
	}

	function handleDragStart(event) {
		const { active } = event

		setActiveId(active.id)
	}

	useEffect(() => {
		onChange(array.map(({ value }) => value))
	}, [array])

	return (
		<Accordion isCompact variant='bordered' className='bg-w4'>
			<AccordionItem key={'1'} aria-label={label} title={label}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}>
					<SortableContext
						items={array.map(p => p._id)}
						strategy={verticalListSortingStrategy}>
						<div className='flex flex-col gap-2'>
							{array.length ? (
								array.map((p, i) => {
									return (
										<ArrayPropertyElement
											key={p._id}
											id={p._id}
											remove={() => removeAt(i)}>
											<El
												key={p._id}
												{...p}
												schema={schema}
												onChange={value => updateAt(i, { ...p, value })}
											/>
										</ArrayPropertyElement>
									)
								})
							) : (
								<div className='w-full text-center text-xs text-default-400'>
									Add some array
								</div>
							)}
						</div>
						<DragOverlay>
							{activeId && (
								// <Item>
								<ArrayPropertyElement id={activeId} remove={() => {}}>
									<El
										{...array.find(x => x._id === activeId)!}
										schema={schema}
										onChange={() => {}}
									/>
								</ArrayPropertyElement>
								// </Item>
							)}
						</DragOverlay>
					</SortableContext>
				</DndContext>
				<Button
					variant='flat'
					color='primary'
					className='w-full mb-3 mt-2'
					onPress={() => {
						push({
							value: PropertyDefaultValue[type],
							type,
							_id: crypto.randomUUID(),
							label: `${label} [${array.length + 1}]`
						})
					}}>
					Add {label} element
				</Button>
			</AccordionItem>
		</Accordion>
	)
}

const ArrayPropertyElement = ({
	children,
	id,
	remove
}: PropsWithChildren<{ id: string; remove: () => void }>) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<div
			style={style}
			{...attributes}
			ref={setNodeRef}
			className='flex flex-row gap-2 items-center aria-pressed:opacity-0 opacity-100'>
			<div
				{...listeners}
				className='flex w-12 h-12 justify-center items-center cursor-grab'>
				<MdDragHandle size={18} />
			</div>
			{children}
			<Button
				isIconOnly
				onClick={remove}
				size='sm'
				variant='light'
				color='danger'>
				<LuTrash />
			</Button>
		</div>
	)
}
