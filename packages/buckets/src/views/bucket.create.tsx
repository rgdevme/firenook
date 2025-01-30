import { Button, Flex, TextInput, Title } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { FC } from 'react'
import { useNavigate } from 'react-router'
import { useBuckets } from '../context/buckets'
import { BucketData } from '../context/types'

export const CreateBucket: FC<{
	edit?: true
}> = ({ edit = false }) => {
	const { create, getAsParam } = useBuckets()

	const nav = useNavigate()

	const form = useForm<BucketData>({
		mode: 'uncontrolled',
		initialValues: {
			path: '',
			name: '',
			bucket: null
		},
		validateInputOnChange: true,
		validate: {
			path: isNotEmpty('Please provide a path'),
			name: isNotEmpty('Please provide a singular name')
		}
	})

	const handleSubmit = async (data: BucketData) => {
		await create(data)
		nav(`/buc/${getAsParam(data)}`)
	}

	return (
		<Flex gap='sm' direction='column'>
			<Flex direction='row' justify='space-between'>
				<Title>{edit ? 'Edit' : 'Create'} Bucket</Title>
				<Flex gap='sm'>
					<Button variant='filled' color='red' onClick={() => nav(-1)}>
						Cancel
					</Button>
					<Button type='submit' form='collection-create'>
						{edit ? 'Save' : 'Create'}
					</Button>
				</Flex>
			</Flex>

			<Flex
				component='form'
				id='collection-create'
				gap='md'
				direction={'column'}
				onSubmit={e => form.onSubmit(handleSubmit)(e as any)}>
				<TextInput
					required
					withAsterisk
					variant='filled'
					label='Name'
					placeholder='Bucket'
					description='Unique collection id for firebase and routing'
					key={form.key('name')}
					{...form.getInputProps('name', { type: 'input' })}
				/>
				<TextInput
					required
					withAsterisk
					variant='filled'
					label='Path'
					placeholder='buckets'
					description='Unique collection id for firebase and routing'
					leftSection='/'
					disabled={edit}
					key={form.key('path')}
					{...form.getInputProps('path', { type: 'input' })}
				/>
			</Flex>
		</Flex>
	)
}
