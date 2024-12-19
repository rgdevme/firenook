import { createGlobalToggle } from '@firenook/core'
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useBucketsList } from '../../context/bucket'
import { BucketData } from '../../types/Bucket'

const [useBucketModalValue, useBucketModalToggle] = createGlobalToggle()
export { useBucketModalToggle }

export const BucketModal = () => {
	const { create } = useBucketsList()
	const isOpen = useBucketModalValue()
	const toggleModal = useBucketModalToggle()

	const [loading, setLoading] = useState(false)
	const { handleSubmit, register } = useForm({
		disabled: loading,
		defaultValues: { name: '', path: '' } as BucketData
	})

	const onSubmit = async (data: BucketData) => {
		try {
			setLoading(true)
			await create(data)
			toggleModal(false)
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={toggleModal}>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Create Bucket
						</ModalHeader>
						<ModalBody>
							<form
								id='create-col'
								className='flex flex-col gap-4'
								onSubmit={handleSubmit(onSubmit)}>
								<Input
									autoFocus
									label='Name'
									placeholder='Bucket'
									variant='bordered'
									color='primary'
									{...register('name', { required: true })}
								/>
								<Input
									label='Path'
									placeholder='buckets'
									variant='bordered'
									{...register('path', { required: true })}
								/>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button
								color='danger'
								variant='light'
								onPress={() => toggleModal(false)}>
								Close
							</Button>
							<Button
								type='submit'
								form='create-col'
								color='primary'
								isLoading={loading}>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
