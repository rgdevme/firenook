import { createGlobalToggle } from '@firenook/core'
import {
	Button,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCollections } from '../../context/collections'
import { CollectionData } from '../../type'

const [useCollectionModalValue, useCollectionModalToggle] = createGlobalToggle()

export { useCollectionModalToggle }

export const CollectionModal = () => {
	const { addCollection, defaultData } = useCollections()
	const isOpen = useCollectionModalValue()
	const toggleModal = useCollectionModalToggle()

	const [loading, setLoading] = useState(false)
	const { handleSubmit, register } = useForm({
		disabled: loading,
		defaultValues: defaultData
	})

	const onSubmit = async ({ schema, ...data }: CollectionData) => {
		try {
			setLoading(true)
			await addCollection({ ...data, schema: [] })
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
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Create collection
						</ModalHeader>
						<ModalBody>
							<form
								id='create-col'
								className='flex flex-col gap-4'
								onSubmit={handleSubmit(onSubmit)}>
								<Input
									autoFocus
									label='Singular'
									placeholder='Collection'
									variant='bordered'
									color='primary'
									{...register('singular', { required: true })}
								/>
								<Input
									label='Plural'
									placeholder='Collections'
									variant='bordered'
									{...register('plural', { required: true })}
								/>
								<Input
									label='Path'
									startContent={'/'}
									placeholder='collection'
									variant='bordered'
									{...register('path', { required: true })}
								/>
								<Checkbox {...register('customId')}>Use custom ID's</Checkbox>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button
								color='danger'
								variant='light'
								onPress={() => {
									onClose()
								}}>
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
