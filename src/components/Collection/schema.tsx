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
import { useEffect, useState } from 'react'
import { useCollectionsList } from '../../context/collectionsList'
import { CollectionStore as cs } from '../../firebase/models/Collection'
import { Property, PropertyType } from '../../firebase/types/Property'
import { SchemaProperty } from './property'

export const CollectionSchema = ({
	isOpen,
	onClose,
	onOpenChange
}: ReturnType<typeof useDisclosure>) => {
	const { current } = useCollectionsList()
	const [loading, setLoading] = useState(false)
	const [initialVal, setInitial] = useState(current?.schema!)
	const [properties, { push, updateAt, removeAt, set }] = useList<Property>()

	const onReset = () => {
		onClose()
		set(initialVal)
	}

	const onSubmit = async () => {
		try {
			if (!current) return
			setLoading(true)
			await cs.save(current.id, { schema: properties })
			onClose()
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!current) return
		setInitial(current.schema)
		set(current.schema)
	}, [current])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top'>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Create collection
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
											filterable: false,
											format: '',
											key: '',
											name: '',
											show: false,
											sortable: true,
											type: key as PropertyType,
											value: '',
											nullable: false
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
							<div id='create-col' className='flex flex-col gap-4'>
								{properties.map((p, i) => (
									<SchemaProperty
										key={i}
										property={p}
										onChange={upd => updateAt(i, { ...p, ...upd })}
										onRemove={() => removeAt(i)}
									/>
								))}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onReset}>
								Close
							</Button>
							<Button color='primary' isLoading={loading} onPress={onSubmit}>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
