import { getAppState, useAppState } from '@firenook/core'
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
import { Fireborm } from 'fireborm'
import { FC, useEffect, useMemo } from 'react'
import { TbArrowNarrowLeft, TbDeviceFloppy, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { getPropertySchema } from '../components/property/context'
import { CollectionData } from '../types/collection'

export const CreateDocument: FC<{ edit?: true }> = ({ edit }) => {
	const nav = useNavigate()
	const form = useForm({
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always'
	})

	const { col_id, doc_id } = useParams()
	const schema = getAppState('property_schema').get()
	console.log({ schema })

	const [fireborm] = useAppState<Fireborm>('fireborm')
	const [collections] = useAppState<CollectionData[]>('collections')

	const collection = useMemo(
		() => collections.find(x => x.path === col_id),
		[col_id, collections]
	)

	const store = useMemo(
		() =>
			!collection
				? undefined
				: fireborm.createStore({
						...collection,
						toModel: doc => {
							const { id, ref } = doc
							return {
								id,
								_ref: ref,
								...doc.data()
							}
						},
						toDocument: ({ id, _ref, ...doc }) => doc
				  }),
		[collection]
	)

	const handleSubmit = async (data: object) => {
		if (!store) return
		if (!doc_id) {
			const res = await store.create(data as any)
			nav(`/col/${col_id}/doc/${res.id}`, { replace: true })
		} else await store.save(doc_id, data)
	}

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

	return (
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
									const el = getPropertySchema(item.type)
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
									const el = getPropertySchema(item.type)
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
				</Grid>
			</Flex>
		</Flex>
	)
}
