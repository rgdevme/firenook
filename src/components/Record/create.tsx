import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure
} from '@nextui-org/react'
import { useState } from 'react'
import { useCollection } from '../../context/collection'
import { useCollectionsList } from '../../context/collectionsList'
import { PropertyType } from '../../firebase/types/Property'

export const CreateRecord = ({
	isOpen,
	onClose,
	onOpenChange
}: ReturnType<typeof useDisclosure>) => {
	const { current } = useCollectionsList()
	const { store } = useCollection()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({})

	const updateData = (upd: {}) => setData(p => ({ ...p, ...upd }))

	const onReset = () => {
		setData({})
		onClose()
	}

	const onSubmit = async () => {
		try {
			if (!store) return
			setLoading(true)
			await store.create(data)
			// await refetch()
			onClose()
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='full'>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Create {store?.singular.toLowerCase()}
						</ModalHeader>
						<ModalBody>
							{current?.customId && (
								<Input
									label='ID'
									onChange={val => updateData({ id: val.target.value })}
								/>
							)}
							{current?.schema.map(property => {
								let el: JSX.Element | null

								switch (property.type) {
									case PropertyType.string:
									case PropertyType.email:
									case PropertyType.phone:
									case PropertyType.url:
										el = (
											<Input
												key={property.key}
												label={property.name}
												onChange={val =>
													updateData({ [property.key]: val.target.value })
												}
											/>
										)
										break
									case PropertyType.number:
										el = (
											<Input
												key={property.key}
												type='number'
												label={property.name}
												onChange={val =>
													updateData({ [property.key]: val.target.value })
												}
											/>
										)
										break

									default:
										el = null
										break
								}

								return el
							})}
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
