import {
	ActionIcon,
	Button,
	Flex,
	Menu,
	Popover,
	Text,
	TextInput
} from '@mantine/core'
import { FirebormStore } from 'fireborm'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { FC } from 'react'
import { TbDotsVertical, TbFilter, TbPlus, TbSearch } from 'react-icons/tb'
import { Link, useParams } from 'react-router'
import {
	Cell,
	CellActionCopy,
	CellActionEdit,
	CellActionTrash
} from '../components/cell'
import { usePropertiesSchemas } from '../components/property/context'
import { StringPropertySchema } from '../components/property/property'
import { useCollectionStore } from '../context/collections'
import { useQueryResult } from '../hooks/useQueryresult'
import { useTableColumns } from '../hooks/useTableColumns'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	const { col_id } = useParams()
	const { collection, store } = useCollectionStore()
	const schemas = usePropertiesSchemas(collection)
	const [query, { onPaginationChange, getInputProps }] = useQueryResult()
	const stringFilters = schemas.filter(
		x => x.type === 'string'
	) as StringPropertySchema[]
	const StringFilterComponent =
		stringFilters.length === 0 ? null : stringFilters[0].filter
	const columns = useTableColumns({
		cell: ({ row, first, column }) => {
			return (
				<Cell
					column={column}
					row={row}
					actions={
						first && (
							<>
								<CellActionCopy value={row.original.id} />
								<CellActionEdit to={`/col/${col_id}/doc/${row.original.id}`} />
								<CellActionTrash
									onClick={() => store?.destroy(row.original.id)}
								/>
							</>
						)
					}
				/>
			)
		}
	})

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
							{StringFilterComponent && (
								<StringFilterComponent
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
