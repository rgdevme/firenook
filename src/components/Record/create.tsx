import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure
} from '@nextui-org/react'
import { useRef, useState } from 'react'
import { useCollection } from '../../context/collection'
import { RecordProperties } from './properties'

export const CreateRecord = ({
	isOpen,
	onClose,
	onOpenChange
}: ReturnType<typeof useDisclosure>) => {
	const { store } = useCollection()
	const [loading, setLoading] = useState(false)
	const data = useRef({})

	const updateData = (upd: {}) => {
		data.current = { ...data.current, ...upd }
	}

	const onReset = () => {
		data.current = {}
		onClose()
	}

	const onSubmit = async () => {
		try {
			if (!store) return
			setLoading(true)
			await store.create(data.current)
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
