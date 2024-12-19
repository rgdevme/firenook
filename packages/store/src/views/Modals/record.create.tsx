import { createGlobalToggle } from '@firenook/core'
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from '@nextui-org/react'
import { useRef, useState } from 'react'
import { useCollection } from '../../context/collection'
import { RecordProperties } from '../Record/properties'

const [useRecordCreateValue, useRecordCreateToggle] = createGlobalToggle()

export { useRecordCreateToggle }

export const CreateRecord = () => {
	const { store } = useCollection()
	const [loading, setLoading] = useState(false)
	const isOpen = useRecordCreateValue()
	const toggleModal = useRecordCreateToggle()
	const data = useRef({})

	const updateData = (upd: {}) => {
		data.current = { ...data.current, ...upd }
	}

	const onReset = () => {
		data.current = {}
		toggleModal(false)
	}

	const onSubmit = async () => {
		try {
			if (!store) return
			setLoading(true)
			await store.create(data.current)
			// await refetch()
			toggleModal(false)
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={toggleModal} size='full'>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Create {store?.singular.toLowerCase()}
						</ModalHeader>
						<ModalBody className='overflow-auto'>
							<RecordProperties record={data} onChange={updateData} />
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
