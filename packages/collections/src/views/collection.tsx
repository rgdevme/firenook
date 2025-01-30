import { useField } from '@firenook/core'
import {
	ActionIcon,
	Button,
	Checkbox,
	Flex,
	Menu,
	Pagination,
	Popover,
	Select,
	Table,
	Text,
	TextInput
} from '@mantine/core'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { TbDotsVertical, TbFilter, TbPlus, TbSearch } from 'react-icons/tb'
import { Link, useParams } from 'react-router'
import { useCollectionStore } from '../context/collections'
import { useQuery } from '../hooks/useQueryresult'
import { CollectionData, CollectionSchemaProperty } from '../types/collection'

export const Collection: FC = () => {
	const { col_id } = useParams()
	const { collection, store } = useCollectionStore()
	const [
		{ data, count, pagination },
		{ getQuery, onChangeCount, onChangePage, onChangeSize, getInputProps }
	] = useQuery(collection?.schema)
	const stringFilters = useStringFilters(collection)
	const [selectedRows, setSelectedRows] = useState<number[]>([])

	useEffect(() => {
		if (!store) return

		const constrains = getQuery()

		store.count(constrains.where).then(count => onChangeCount(count))
		store.subscribeMany(constrains)
	}, [store, getQuery])

	return !collection ? (
		'loading'
	) : (
		<Flex direction='column' gap='xs' h='100%'>
			<Flex gap='md' flex='0 0 0'>
				<TextInput
					name='search'
					placeholder='Search'
					flex='1 1 auto'
					leftSection={<TbSearch />}
					rightSectionProps={{
						style: {
							justifyContent: 'flex-end',
							width: 'min-content',
							paddingRight: 2
						}
					}}
					rightSection={
						<Popover position='bottom-end'>
							<Popover.Target>
								<Button size='xs' variant='subtle' leftSection={<TbFilter />}>
									Filters
								</Button>
							</Popover.Target>
							<Popover.Dropdown p={4}>
								<Flex direction='column' gap='xs'>
									<Text size='xs' c='dimmed' fw={500} px='xs' py={4}>
										Filtering options
									</Text>
									{stringFilters.filter && (
										<stringFilters.filter
											fields={stringFilters.properties}
											keyname='filters'
											label=''
											type='string'
											isDirty={false}
											isSubmitting={false}
											{...getInputProps('searchBy')}
										/>
									)}
								</Flex>
							</Popover.Dropdown>
						</Popover>
					}
					{...getInputProps('search')}
				/>
				<Button
					variant='light'
					leftSection={<TbPlus />}
					component={Link}
					to={`/col/${col_id}/new`}>
					New
				</Button>
				<Menu position='bottom-end'>
					<Menu.Target>
						<ActionIcon size='input-sm' variant='subtle'>
							<TbDotsVertical />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Collection options</Menu.Label>
						<Menu.Item component={Link} to={`/col/${col_id}/edit`}>
							Edit
						</Menu.Item>
						<Menu.Item>Delete Collection</Menu.Item>
						<Menu.Item>Standardize</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Flex>

			<Table
				flex='1 0 auto'
				striped
				highlightOnHover
				horizontalSpacing='sm'
				verticalSpacing='sm'
				stickyHeader
				stickyHeaderOffset={0}
				data={{
					head: [
						<Checkbox
							aria-label='Select all'
							checked={selectedRows.length === data.length && data.length > 0}
							onChange={event =>
								setSelectedRows(
									event.currentTarget.checked ? data.map(x => x.id) : []
								)
							}
						/>,
						...collection.schema.map(s => s.label)
					],
					body: data.map(x => [
						<Checkbox
							aria-label='Select row'
							checked={selectedRows.includes(x.id)}
							onChange={event =>
								setSelectedRows(
									event.currentTarget.checked
										? [...selectedRows, x.id]
										: selectedRows.filter(id => id !== x.id)
								)
							}
						/>,
						...collection.schema.map(s => x[s.keyname] as ReactNode)
					])
				}}
			/>
			<Flex
				flex='0 0 0'
				direction='row'
				wrap='nowrap'
				gap='xs'
				align='center'
				justify='flex-end'>
				<Select
					value={pagination.size.toString()}
					data={[
						{ label: '1', value: '1' },
						{ label: '2', value: '2' },
						{ label: '5', value: '5' },
						{ label: '10', value: '10' },
						{ label: '20', value: '20' },
						{ label: '50', value: '50' },
						{ label: '100', value: '100' }
					]}
					onChange={onChangeSize}
				/>
				<Pagination
					withPages={false}
					total={Math.ceil(count / pagination.size)}
					value={pagination.index}
					onChange={onChangePage}
				/>
			</Flex>
		</Flex>
	)
}

const useStringFilters = (collection?: CollectionData) => {
	const field = useField('string')

	const state = useMemo(() => {
		const res = {
			filter: undefined as NonNullable<typeof field>['filter'],
			properties: [] as CollectionSchemaProperty[]
		}
		if (!collection || !field) return res
		const properties = collection.schema.filter(x => x.type === 'string')
		if (!properties.length) return res
		res.properties = properties
		res.filter = field.filter
		return res
	}, [collection, field])

	return state
}
