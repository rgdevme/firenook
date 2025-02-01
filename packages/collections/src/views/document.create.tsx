import { getField } from '@firenook/core'
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
import { FC, ReactNode, useEffect, useState } from 'react'
import { TbArrowNarrowLeft, TbDeviceFloppy, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import {
	getDefaultDocumentData,
	useCollectionStore
} from '../context/collections'

export const CreateDocument: FC<{ edit?: true }> = ({ edit }) => {
	const nav = useNavigate()
	const { col_id, doc_id } = useParams()
	const { collection, store, defaultData } = useCollectionStore()

	const [columns, setColumns] = useState<{
		left: ReactNode[]
		right: ReactNode[]
	}>({ left: [], right: [] })

	const form = useForm({
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always'
	})

	const handleSubmit = async (data: any) => {
		if (!store) return
		if (!doc_id) {
			const res = await store.create(data)
			nav(`/col/${col_id}/doc/${res.id}`, { replace: true })
		} else await store.save(doc_id, data)
	}

	useEffect(() => {
		if (!store) return

		if (!doc_id) {
			form.initialize(getDefaultDocumentData(collection!))
			return
		}

		store.subscribe(doc_id, {
			onChange: data => {
				if (!data) return
				const upd = { ...defaultData }
				collection?.schema.forEach(prop => {
					upd[prop.keyname] = data[prop.keyname]
				})
				form.initialize({ ...upd })
			}
		})
	}, [store, doc_id])

	useEffect(() => {
		if (!collection) return
		setColumns(
			collection.schema.reduce(
				(cols, item) => {
					const el = getField(item.type)
					const inputProps = form.getInputProps(item.keyname, { type: 'input' })

					if (el?.input && inputProps.defaultValue !== undefined) {
						cols[item.side].push(
							<el.input
								{...item}
								key={item.keyname}
								isSubmitting={form.submitting}
								isDirty={form.isDirty(item.keyname)}
								{...inputProps}
							/>
						)
					}
					return cols
				},
				{ left: [], right: [] } as typeof columns
			)
		)
	}, [form.initialized, collection?.schema])

	return !form.initialized ? null : (
		<Flex
			gap='sm'
			direction='column'
			w='100%'
			maw={1024}
			pos='relative'
			left='50%'
			style={{ transition: 'margin 150ms', transform: 'translateX(-50%)' }}>
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
					<Grid.Col span={{ sm: columns.right.length ? 8 : 12, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{columns.left}
						</Flex>
					</Grid.Col>
					{!!columns.right.length && (
						<Grid.Col span={{ sm: 4, xs: 12 }}>
							<Flex direction='column' gap='xs'>
								{columns.right}
							</Flex>
						</Grid.Col>
					)}
				</Grid>
			</Flex>
		</Flex>
	)
}
