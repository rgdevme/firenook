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
import { FC, ReactNode, useMemo } from 'react'
import {
	TbCategoryPlus,
	TbChevronDown,
	TbGripHorizontal,
	TbTrash
} from 'react-icons/tb'
import { CollectionData, CollectionStore } from '../types/collection'
import { getDefaultSchemaProperty, SchemaProperty } from '../types/schema'

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
	const store = getAppState<CollectionStore>('settingsStore').get()
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
			defaultData: {},
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

	const updateSchemaProperty = (index: number) => (schema: SchemaProperty) => {
		const update = [...form.getValues().schema]
		update.splice(index, 1, schema)
		form.setFieldValue('schema', update)
	}

	const addSchemaProperty = (side: SchemaProperty['side']) => () => {
		const update = [...form.getValues().schema]
		update.push(getDefaultSchemaProperty(side))
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

	const { left, right } = form.getValues().schema.reduce(
		(sides, item, index) => {
			sides[item.side].push(
				<ProvisionalPropertyComponent
					key={item.id}
					onChange={updateSchemaProperty(index)}
					onTrash={removeSchemaPropety(index)}
					{...item}
				/>
			)
			return sides
		},
		{ left: [], right: [] } as { left: ReactNode[]; right: ReactNode[] }
	)

	return (
		<Flex gap='sm' direction='column'>
			<Flex direction='row' justify='space-between'>
				<Title>{edit ? 'Edit' : 'Create'} Collection</Title>
				<Flex gap='sm'>
					<Button variant='filled' color='red' onClick={() => nav(-1)}>
						Cancel
					</Button>
					<Button type='submit' form='collection-create'>
						{edit ? 'Edit' : 'Create'}
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

import { getAppState } from '@firenook/core'
import { useDebouncedCallback, useElementSize, useToggle } from '@mantine/hooks'
import { useNavigate } from 'react-router'

const ProvisionalPropertyComponent = ({
	onChange,
	onTrash,
	...props
}: SchemaProperty & {
	onChange: (data: SchemaProperty) => void
	onTrash: () => void
}) => {
	const [open, toggle] = useToggle()
	const { ref, height } = useElementSize()
	const debouncedOnChange = useDebouncedCallback(onChange, 350)

	const form = useForm<SchemaProperty>({
		initialValues: props,
		onValuesChange: (current, previous) => {
			if (current.name === getPath(previous.label)) {
				form.setFieldValue('name', getPath(current.label))
			}
			debouncedOnChange(current)
		}
	})

	return (
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
							{...form.getInputProps('name', { type: 'input' })}
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
						data={[
							{ label: 'Text', value: 'string' },
							{ label: 'Number', value: 'number' },
							{ label: 'Email', value: 'email' },
							{ label: 'Phone', value: 'phone' },
							{ label: 'Checkbox', value: 'checkbox' }
						]}
						{...form.getInputProps('type', { type: 'input' })}
					/>
					<TextInput
						size='xs'
						variant='filled'
						flex='1 1 45%'
						placeholder='Default value'
						{...form.getInputProps('defaultValue', { type: 'input' })}
					/>
					<Switch
						size='xs'
						label='Nullable'
						{...form.getInputProps('nullable', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Sort'
						{...form.getInputProps('sortable', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Filter'
						{...form.getInputProps('filterable', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Show'
						{...form.getInputProps('show', { type: 'checkbox' })}
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
