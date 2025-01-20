import { useAppState } from '@firenook/core'
import {
	ActionIcon,
	Button,
	CopyButton,
	Flex,
	Menu,
	Popover,
	Text,
	TextInput,
	Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { Fireborm, FirebormStore, QueryOptions, Where } from 'fireborm'
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef
} from 'mantine-react-table'
import { FC, useEffect, useMemo, useState } from 'react'
import {
	TbCheck,
	TbDotsVertical,
	TbFilter,
	TbKey,
	TbPencil,
	TbPlus,
	TbSearch,
	TbTrash
} from 'react-icons/tb'
import { Link, useParams } from 'react-router'
import { usePropertiesSchemas } from '../components/property/context'
import { StringFilter } from '../components/property/string'
import { CollectionData } from '../types/collection'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	const { col_id } = useParams()
	const [fireborm] = useAppState<Fireborm>('fireborm')
	const [collections] = useAppState<CollectionData[]>('collections')
	const collection = collections.find(x => x.path === col_id)

	// Filter form state
	const schemas = usePropertiesSchemas(collection)
	const stringFilters = useMemo(
		() => schemas.filter(x => x.type === 'string'),
		[schemas]
	)
	const [count, setCount] = useState(0)
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 2
	})
	const [pointers, setPointers] = useState({
		first: null as null | any,
		last: null as null | any
	})
	const [queryPagination, setQueryPagination] = useState<
		NonNullable<QueryOptions['pagination']>
	>({
		pointer: null,
		start: true,
		include: false
	})
	const filterForm = useForm({
		initialValues: {
			searchBy: '',
			search: '',
			direction: 'asc' as 'asc' | 'desc',
			order: ''
		},
		transformValues: ({ order, ...values }) => ({
			...values,
			order: order.length > 0 ? order : undefined
		})
	})
	const [debouncedFilter] = useDebouncedValue(filterForm.getValues(), 300)

	useEffect(() => {
		if (!stringFilters?.[0]) return
		filterForm.setValues({ searchBy: stringFilters?.[0].name })
	}, [stringFilters])

	// Filter form state end

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

	const [data, setData] = useState<any[]>([])
	const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
		const cols: MRT_ColumnDef<any>[] = []
		if (!collection) return cols

		collection.schema.forEach((column, index) => {
			cols.push({
				header: column.label,
				accessorKey: column.name,
				enableSorting: column.sortable,
				enableColumnFilter: column.filterable,
				Cell: ({ row }) => {
					return (
						<Flex gap='xs' align='center' w='100%'>
							<Text flex='1 1 auto'>{row.original[column.name]}</Text>
							{!index && (
								<>
									<CopyButton value={row.original.id} timeout={2000}>
										{({ copied, copy }) => (
											<Tooltip
												label={copied ? 'ID copied' : 'Copy ID'}
												position='left'>
												<ActionIcon
													variant='subtle'
													color='stone.3'
													size='md'
													onClick={copy}>
													{copied ? (
														<TbCheck />
													) : (
														<TbKey />
														// <IconCopy size={16} />
													)}
												</ActionIcon>
											</Tooltip>
										)}
									</CopyButton>

									<Tooltip label='Edit' position='left'>
										<ActionIcon
											variant='light'
											size='md'
											component={Link}
											to={`/col/${col_id}/doc/${row.original.id}`}>
											<TbPencil />
										</ActionIcon>
									</Tooltip>

									<Menu>
										<Menu.Target>
											<ActionIcon variant='subtle' color='stone.3' size='md'>
												<TbDotsVertical />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Label>Row actions</Menu.Label>
											<Menu.Item
												leftSection={<TbTrash />}
												onClick={() => store?.destroy(row.original.id)}>
												Delete
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</>
							)}
						</Flex>
					)
				}
			})
		})

		if (cols.length === 0) {
			cols.push({
				header: 'ID',
				accessorKey: 'id',
				enableSorting: false,
				enableColumnFilter: false,
				enableClickToCopy: true,
				grow: false,
				maxSize: 200,
				minSize: 10
			})
		}

		return cols
	}, [store])

	const table = useMantineReactTable({
		columns,
		data,
		layoutMode: 'grid',
		initialState: { density: 'xs' },
		mantinePaperProps: {
			withBorder: false,
			shadow: undefined
		},
		enableStickyHeader: true,
		enableSelectAll: true,
		enableRowSelection: true,
		enableGlobalFilter: false,
		enableTopToolbar: false,
		enableFilters: false,
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		mantinePaginationProps: {
			controls: false
		},
		// onRowSelectionChange: setRowSelection,
		// onColumnFiltersChange: setColumnFilters,
		onPaginationChange: val => {
			if (typeof val !== 'function') return
			const old = { ...pagination }
			const update = val(pagination)
			const changedLimit = update.pageSize !== old.pageSize

			setPagination({
				pageIndex: changedLimit ? 1 : update.pageIndex,
				pageSize: update.pageSize
			})

			const start = update.pageIndex >= old.pageIndex

			setQueryPagination({
				include: false,
				start,
				pointer: changedLimit ? null : start ? pointers.last : pointers.first
			})
		},
		// onSortingChange: setSorting,
		getRowId: row => row.id,
		rowCount: count,
		state: {
			isLoading: false,
			showProgressBars: false,
			showAlertBanner: false,
			// columnFilters,
			pagination
			// sorting,
			// rowSelection
		}
	})

	useEffect(() => {
		if (!store) return

		const { search, searchBy, ...rest } = filterForm.getTransformedValues()

		const where: Where = []

		if (searchBy.length && search.length) {
			where.push({
				and: [
					[searchBy, '>=', search],
					[searchBy, '<=', search + '~']
				]
			})
		}

		store.count(where).then(setCount)
		store.subscribeMany({
			where,
			...rest,
			pagination: queryPagination,
			limit: pagination.pageSize,
			order: 'name',
			onChange: ({ first, last, data }) => {
				setPointers({ first, last })
				setData(data)
			}
		})
	}, [store, debouncedFilter, queryPagination, pagination.pageSize])

	return !collection ? (
		'loading'
	) : (
		<div>
			<Flex gap='md'>
				<TextInput
					name='search'
					placeholder='Search'
					flex='1 1 auto'
					leftSection={<TbSearch />}
					{...filterForm.getInputProps('search')}
				/>
				<Popover position='bottom-end'>
					<Popover.Target>
						<ActionIcon size='input-sm' variant='subtle'>
							<TbFilter />
						</ActionIcon>
					</Popover.Target>
					<Popover.Dropdown p={4}>
						<Flex direction='column' gap='xs'>
							<Text size='xs' c='dimmed' fw={500} px='xs' py={4}>
								Filtering options
							</Text>
							{stringFilters.length > 0 && (
								<StringFilter
									fields={stringFilters}
									inputProps={filterForm.getInputProps('searchBy')}
								/>
							)}
						</Flex>
					</Popover.Dropdown>
				</Popover>
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

			<MantineReactTable table={table} />
		</div>
	)
}
