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
import { FirebormStore } from 'fireborm'
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef
} from 'mantine-react-table'
import { FC, useMemo } from 'react'
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
import { useCollectionStore } from '../context/collections'
import { useQueryResult } from '../hooks/useQueryresult'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	const { col_id } = useParams()
	const { collection, store } = useCollectionStore()

	const [query, { onPaginationChange, getInputProps }] = useQueryResult()

	const schemas = usePropertiesSchemas(collection)
	const stringFilters = useMemo(
		() => schemas.filter(x => x.type === 'string'),
		[schemas]
	)

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
													{copied ? <TbCheck /> : <TbKey />}
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
		data: query.data,
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
		onPaginationChange,
		getRowId: row => row.id,
		rowCount: query.count,
		state: {
			isLoading: false,
			showProgressBars: false,
			showAlertBanner: false,
			pagination: query.pagination
		}
	})

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
					{...getInputProps('search')}
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
									inputProps={getInputProps('searchBy')}
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
