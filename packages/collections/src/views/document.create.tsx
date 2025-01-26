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
	getDocumentDefaultValues,
	getPropertySchema
} from '../components/property/context'
import { BasePropertySchema } from '../components/property/property'
import { useCollectionStore } from '../context/collections'

export const CreateDocument: FC<{ edit?: true }> = ({ edit }) => {
	const nav = useNavigate()
	const { col_id, doc_id } = useParams()
	const { collection, store } = useCollectionStore()

	const [initialValues, setInitialValues] = useState(() =>
		!collection ? {} : getDocumentDefaultValues(collection)
	)
	const [columns, setColumns] = useState<{
		left: ReactNode[]
		right: ReactNode[]
	}>({ left: [], right: [] })

	const form = useForm({
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
		initialValues
	})

	const handleSubmit = async (data: any) => {
		if (!store) return
		if (!doc_id) {
			const res = await store.create(data)
			nav(`/col/${col_id}/doc/${res.id}`, { replace: true })
		} else await store.save(doc_id, data)
	}

	useEffect(() => {
		if (!collection || !store || !doc_id) return

		store.subscribe(doc_id, {
			onChange: data => {
				if (!data) return
				const upd = getDocumentDefaultValues(collection)

				collection?.schema.forEach(prop => {
					upd[prop.name] = data[prop.name]
				})

				setInitialValues({ ...upd })
			}
		})
	}, [store, doc_id])

	useEffect(() => {
		if (!collection) return

		console.log({ initialValues })
		form.setInitialValues(initialValues)
		form.setValues(initialValues)
		form.reset()

		setColumns(
			collection.schema.reduce(
				(cols, item) => {
					const el: BasePropertySchema | undefined = getPropertySchema(
						item.type
					)
					const inputProps = form.getInputProps(item.name, { type: 'input' })

					console.log({ inputProps })

					if (el && inputProps.defaultValue !== undefined) {
						cols[el.side].push(
							<el.element
								{...item}
								key={item.name}
								submitting={form.submitting}
								dirty={form.isDirty(item.name)}
								inputProps={inputProps}
							/>
						)
					}
					return cols
				},
				{ left: [], right: [] } as typeof columns
			)
		)
	}, [JSON.stringify(initialValues)])

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
							{columns.left}
						</Flex>
					</Grid.Col>
					<Grid.Col span={{ md: 4, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{columns.right}
						</Flex>
					</Grid.Col>
				</Grid>
			</Flex>
		</Flex>
	)
}
