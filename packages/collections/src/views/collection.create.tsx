import {
	ActionIcon,
	Button,
	Divider,
	Flex,
	Grid,
	Paper,
	Select,
	SimpleGrid,
	Switch,
	Text,
	TextInput,
	Title
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { FC, ReactNode, useEffect, useMemo } from 'react'
import {
	TbCategoryPlus,
	TbChevronDown,
	TbGripHorizontal,
	TbTrash
} from 'react-icons/tb'
import { CollectionData, CollectionSchemaProperty } from '../types/collection'

const getPath = (singular: string) => singular.toLowerCase().replace(/ +/g, '_')

const getPlural = (singular: string) => (!singular.length ? '' : singular + 's')

const examples = [
	'Post',
	'Student',
	'Tag',
	'Hat',
	'Body part',
	'Dog',
	'User',
	'Friend'
].map(x => [x, getPlural(x), getPath(x)])

export const CreateCollection: FC<{
	edit?: true
}> = ({ edit = false }) => {
	const { col_id } = useParams()
	const [store] = useAppState('settingsStore')
	const [collections] = useAppState('collections')

	const nav = useNavigate()

	const [singularPlaceholder, pluralPlaceholder, pathPlaceholder] = useMemo(
		() => examples[Math.floor(Math.random() * examples.length)],
		[]
	)

	const form = useForm<CollectionData>({
		mode: 'uncontrolled',
		initialValues: {
			customId: false,
			path: '',
			plural: '',
			singular: '',
			schema: [],
			showId: true
		},
		validateInputOnChange: true,
		onValuesChange: (current, previous) => {
			console.log(current)

			if (current.path === getPath(previous.singular)) {
				form.setFieldValue('path', getPath(current.singular))
			}

			if (current.plural === getPlural(previous.singular)) {
				form.setFieldValue('plural', getPlural(current.singular))
			}
		},
		validate: {
			path: isNotEmpty('Please provide a path'),
			singular: isNotEmpty('Please provide a singular name'),
			plural: isNotEmpty('Please provide a plural name')
		}
	})

	const updateSchemaProperty =
		(index: number) => (schema: CollectionSchemaProperty) => {
			const update = [...form.getValues().schema]
			let newSchema = { ...schema }

			if (update[index].type !== schema.type) {
				const { defaultValue } = getField(schema.type)!
				newSchema = { ...schema, defaultValue }
			}

			update.splice(index, 1, newSchema)
			form.setFieldValue('schema', update)
		}

	const addSchemaProperty = (side: CollectionSchemaProperty['side']) => () => {
		const update = [...form.getValues().schema]
		update.push({ ...getDefaultSchemaPropertyData(), side })
		form.setFieldValue('schema', update)
	}

	const removeSchemaPropety = (index: number) => () => {
		const update = [...form.getValues().schema]
		update.splice(index, 1)
		form.setFieldValue('schema', update)
	}

	const handleSubmit = async (data: CollectionData) => {
		await store.save('col', { [data.path]: data } as any)
		nav(`/col/${data.path}`)
	}

	const initalSchema = getDefaultSchemaPropertyData()
	const { left, right } = useMemo(
		() =>
			form.getValues().schema.reduce(
				(sides, item, index) => {
					const passedProps = { ...initalSchema }

					for (const key in initalSchema) {
						if (key in item) passedProps[key] = item[key]
					}

					console.log({
						item,
						initalSchema,
						values: form.getValues(),
						passedProps
					})

					sides[item.side].push(
						<ProvisionalPropertyComponent
							key={passedProps.keyname}
							item={passedProps}
							onChange={updateSchemaProperty(index)}
							onTrash={removeSchemaPropety(index)}
						/>
					)
					return sides
				},
				{ left: [], right: [] } as { left: ReactNode[]; right: ReactNode[] }
			),
		[form.getValues().schema.length]
	)

	useEffect(() => {
		if (!col_id) return
		const collection = collections.find(x => x.path === col_id)
		if (!collection) return
		form.setInitialValues(collection)
		form.reset()
	}, [col_id, collections])

	return (
		<Flex gap='sm' direction='column'>
			<Flex direction='row' justify='space-between'>
				<Title>{edit ? 'Edit' : 'Create'} Collection</Title>
				<Flex gap='sm'>
					<Button variant='filled' color='red' onClick={() => nav(-1)}>
						Cancel
					</Button>
					<Button type='submit' form='collection-create'>
						{edit ? 'Save' : 'Create'}
					</Button>
				</Flex>
			</Flex>
			<Text size='sm' c='stone.4'>
				Handle collection creation and edition along with the schema
			</Text>
			<Flex
				component='form'
				id='collection-create'
				gap='md'
				direction={'column'}
				onSubmit={e => form.onSubmit(handleSubmit)(e as any)}>
				<Divider
					label={<Title order={4}>Basic information</Title>}
					labelPosition='left'
				/>
				<SimpleGrid cols={{ xs: 2, sm: 3 }}>
					<TextInput
						required
						withAsterisk
						variant='filled'
						label='Singular'
						description='Name for a single instance in the collection'
						placeholder={singularPlaceholder}
						key={form.key('singular')}
						{...form.getInputProps('singular', { type: 'input' })}
					/>
					<TextInput
						required
						withAsterisk
						variant='filled'
						label='Plural'
						description='Name for a group of instances in the collection'
						placeholder={pluralPlaceholder}
						key={form.key('plural')}
						{...form.getInputProps('plural', { type: 'input' })}
					/>
					<TextInput
						required
						withAsterisk
						variant='filled'
						label='Path'
						description='Unique collection id for firebase and routing'
						leftSection='/'
						placeholder={pathPlaceholder}
						disabled={edit}
						key={form.key('path')}
						{...form.getInputProps('path', { type: 'input' })}
					/>
				</SimpleGrid>
				<Flex>
					<Switch
						label='Allow custom IDs'
						flex='1 1 auto'
						description='Allow for the user to define a personalized ID instead of using an auto-generated one.'
						key={form.key('customId')}
						{...form.getInputProps('customId', { type: 'checkbox' })}
					/>
					<Switch
						label='Show ID'
						flex='1 1 auto'
						description='Show ID as the first cell in the row.'
						key={form.key('showId')}
						{...form.getInputProps('showId', { type: 'checkbox' })}
					/>
				</Flex>
				<Divider label={<Title order={4}>Schema</Title>} labelPosition='left' />
				<Grid>
					<Grid.Col span={{ md: 8, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{...left}
							<Button
								fullWidth
								variant='subtle'
								leftSection={<TbCategoryPlus />}
								onClick={addSchemaProperty('left')}>
								Add schema property
							</Button>
						</Flex>
					</Grid.Col>
					<Grid.Col span={{ md: 4, xs: 12 }}>
						<Flex direction='column' gap='xs'>
							{...right}
							<Button
								fullWidth
								variant='subtle'
								leftSection={<TbCategoryPlus />}
								onClick={addSchemaProperty('right')}>
								Add schema property
							</Button>
						</Flex>
					</Grid.Col>
				</Grid>
			</Flex>
		</Flex>
	)
}

import { getField, useAppState, useField, useFields } from '@firenook/core'
import { useDebouncedCallback, useElementSize, useToggle } from '@mantine/hooks'
import { useNavigate, useParams } from 'react-router'
import { getDefaultSchemaPropertyData } from '../context/collections'

const ProvisionalPropertyComponent = ({
	onChange,
	onTrash,
	item
}: {
	item: CollectionSchemaProperty
	onChange: (data: CollectionSchemaProperty) => void
	onTrash: () => void
}) => {
	const [open, toggle] = useToggle()
	const { ref, height } = useElementSize()
	const debouncedOnChange = useDebouncedCallback(onChange, 350)
	const [fields] = useFields()

	const fieldTypes = [...fields.values()].map(f => ({
		label: f.name,
		value: f.type
	}))

	const schemaProp = useField(item.type)

	const form = useForm<CollectionSchemaProperty>({
		initialValues: item,
		onValuesChange: (current, previous) => {
			if (current.keyname === getPath(previous.label)) {
				form.setFieldValue('keyname', getPath(current.label))
			}
			debouncedOnChange(current)
		}
	})

	return !schemaProp?.input ? null : (
		<Paper p='xs' withBorder>
			<Flex gap='xs' direction='column'>
				<Flex direction='row' wrap='nowrap' gap='xs' align='center'>
					<ActionIcon variant='subtle'>
						<TbGripHorizontal />
					</ActionIcon>
					<Flex gap='xs' w='100%' direction='row'>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='Property name'
							{...form.getInputProps('label', { type: 'input' })}
						/>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='property_key'
							{...form.getInputProps('keyname', { type: 'input' })}
						/>
					</Flex>
					<ActionIcon variant='subtle' onClick={onTrash}>
						<TbTrash />
					</ActionIcon>
					<ActionIcon variant='subtle' onClick={() => toggle()}>
						<TbChevronDown
							data-open={open}
							style={{
								transform: open ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
								transition: 'all 150ms ease-in-out'
							}}
						/>
					</ActionIcon>
				</Flex>

				<Flex
					ref={ref}
					justify='space-between'
					align='center'
					wrap='wrap'
					direction='row'
					px={40}
					gap='xs'
					style={{
						maxHeight: '5rem',
						height: open ? height || 'auto' : 0,
						opacity: open ? 1 : 0,
						marginTop: !open ? '-8px' : 0,
						transition: 'all'
					}}>
					<Select
						size='xs'
						variant='filled'
						flex='1 1 45%'
						placeholder='Select a type'
						data={fieldTypes}
						{...form.getInputProps('type', { type: 'input' })}
					/>
					<schemaProp.input
						isDirty={false}
						isSubmitting={false}
						{...item}
						{...form.getInputProps('defaultValue', { type: 'input' })}
						label={undefined}
						placeholder='Default value'
						key={item.keyname}
					/>
					<Switch
						size='xs'
						label='Nullable'
						{...form.getInputProps('isNullable', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Sort'
						{...form.getInputProps('isSort', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Filter'
						{...form.getInputProps('isFilter', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Show'
						{...form.getInputProps('isShown', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Array'
						{...form.getInputProps('isArray', { type: 'checkbox' })}
					/>
				</Flex>
			</Flex>
		</Paper>
	)
}
