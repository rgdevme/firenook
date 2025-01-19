import { useAppState } from '@firenook/core'
import { ActionIcon, Button, Flex, Menu, Text, TextInput } from '@mantine/core'
import { Fireborm, FirebormStore } from 'fireborm'
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef
} from 'mantine-react-table'
import { FC, useEffect, useMemo, useState } from 'react'
import {
	TbDotsVertical,
	TbFilter,
	TbPlus,
	TbSearch,
	TbTrash
} from 'react-icons/tb'
import { Link, useParams } from 'react-router'
import { CollectionData } from '../types/collection'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	const { col_id } = useParams()
	const [fireborm] = useAppState<Fireborm>('fireborm')
	const [collections] = useAppState<CollectionData[]>('collections')
	const collection = collections.find(x => x.path === col_id)
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

		if (collection.showId) {
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

		collection.schema.forEach((column, index) => {
			cols.push({
				header: column.label,
				accessorKey: column.name,
				enableSorting: column.sortable,
				enableColumnFilter: column.filterable,
				Cell: ({ row }) => {
					return (
						<Flex gap='xs' align='center'>
							<Text flex='1 1 auto'>{row.original[column.name]}</Text>
							{!index && (
								<>
									<Button
										variant='light'
										size='xs'
										component={Link}
										to={`/col/${col_id}/doc/${row.original.id}`}>
										Edit
									</Button>
									<Menu>
										<Menu.Target>
											<ActionIcon variant='light' size='md'>
												<TbDotsVertical />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
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

		return cols
	}, [store])
	const table = useMantineReactTable({
		enableRowSelection: true,
		enableSelectAll: true,
		enableDensityToggle: false,
		enableFullScreenToggle: false,
		columns,
		data,
		layoutMode: 'grid',
		initialState: { density: 'xs' },
		mantinePaperProps: {
			withBorder: false,
			shadow: undefined
		},
		onPaginationChange: console.log,
		onSortingChange: console.log,
		onGlobalFilterChange: console.log,
		onColumnOrderChange: console.log,
		onColumnFiltersChange: console.log
	})

	useEffect(() => {
		if (!store) return
		store.subscribeMany({ where: [], onChange: setData })
	}, [store])

	return !collection ? (
		'loading'
	) : (
		<div>
			<Flex gap='md'>
				<TextInput
					name='search'
					placeholder='Search'
					leftSection={<TbSearch />}
					flex='1 1 auto'
				/>
				<Menu position='bottom-end'>
					<Menu.Target>
						<ActionIcon size='input-sm' variant='subtle'>
							<TbFilter />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Filtering options</Menu.Label>
					</Menu.Dropdown>
				</Menu>
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
