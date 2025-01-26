import {
	ActionIcon,
	Button,
	Flex,
	Grid,
	Popover,
	Text,
	Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { FC, useEffect } from 'react'
import { TbArrowNarrowLeft, TbDeviceFloppy, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import {
	getDocumentDefaultValues,
	getPropertySchema
} from '../components/property/context'
import { BasePropertySchema } from '../components/property/property'
import { useCollectionStore } from '../context/collections'

export const CreateDocument: FC<{ edit?: true }> = ({ edit }) => {
	const nav = useNavigate()
	const { col_id, doc_id } = useParams()
	const { collection, store } = useCollectionStore()

	console.log({ collection })

	const form = useForm({
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
		initialValues: {},
		onValuesChange: console.log
	})

	const handleSubmit = async (data: any) => {
		if (!store) return
		if (!doc_id) {
			const res = await store.create(data)
			nav(`/col/${col_id}/doc/${res.id}`, { replace: true })
		} else await store.save(doc_id, data)
	}

	useEffect(() => {
		if (!collection) return
		const def = getDocumentDefaultValues(collection)
		console.log({ def })
		if (Object.keys(def).length) return
		form.setInitialValues(def)
		form.setValues(def)
		form.reset()
	}, [collection])

	useEffect(() => {
		if (!store || !doc_id) return
		store.subscribe(doc_id, {
			onChange: data => {
				if (!data) return
				const upd = {}

				collection?.schema.forEach(prop => {
					upd[prop.name] = data[prop.name]
				})

				form.setInitialValues(upd)
				form.setValues(upd)
				form.reset()
			}
		})
	}, [store, doc_id])

	return !collection ? null : (
		<Flex gap='sm' direction='column'>
			<Flex direction='row' gap='sm' align='center'>
				<ActionIcon variant='subtle' color='red' onClick={() => nav(-1)}>
					<TbArrowNarrowLeft />
				</ActionIcon>
				<Title order={3}>{edit ? 'Edit' : 'Create'} Document</Title>
				<Flex flex='1 1 auto' gap='sm' justify='flex-end'>
					{edit && (
						<Popover shadow='md'>
							<Popover.Target>
								<Button color='rose' variant='subtle' leftSection={<TbTrash />}>
									Trash
								</Button>
							</Popover.Target>
							<Popover.Dropdown p='xs' maw={200}>
								<Flex direction='column' gap='xs'>
									<Text size='xs' ta='center'>
										This action can't be undone.
									</Text>
									<Button
										size='xs'
										color='rose'
										fullWidth
										onClick={async () => {
											if (!store || !doc_id) return
											await store.destroy(doc_id)
											nav(`/col/${col_id}`, { replace: true })
										}}>
										I understand
									</Button>
								</Flex>
							</Popover.Dropdown>
						</Popover>
					)}
					<Button
						type='submit'
						form='collection-create'
						leftSection={<TbDeviceFloppy />}
						disabled={!form.isDirty()}>
						Save
					</Button>
				</Flex>
			</Flex>
			<Flex
				component='form'
				id='collection-create'
				gap='md'
				direction={'column'}
				onSubmit={e => form.onSubmit(handleSubmit)(e as any)}>
				<Grid>
					<Grid.Col span={{ md: 8, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{(collection?.schema ?? [])
								.filter(({ side }) => side === 'left')
								.map(item => {
									const el: BasePropertySchema | undefined = getPropertySchema(
										item.type
									)
									if (!el) return
									return (
										<el.element
											key={item.name}
											submitting={form.submitting}
											dirty={form.isDirty(item.name)}
											inputProps={form.getInputProps(item.name)}
											{...item}
										/>
									)
								})}
						</Flex>
					</Grid.Col>
					<Grid.Col span={{ md: 4, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{(collection?.schema ?? [])
								.filter(({ side }) => side === 'right')
								.map(item => {
									const el: BasePropertySchema | undefined = getPropertySchema(
										item.type
									)

									if (!el) return
									return (
										<el.element
											{...item}
											key={item.name}
											submitting={form.submitting}
											dirty={form.isDirty(item.name)}
											inputProps={form.getInputProps(item.name)}
										/>
									)
								})}
						</Flex>
					</Grid.Col>
				</Grid>
			</Flex>
		</Flex>
	)
}
