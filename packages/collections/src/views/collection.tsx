import { useAppState } from '@firenook/core'
import { ActionIcon, Button, Flex, Menu, Table, TextInput } from '@mantine/core'
import { Fireborm, FirebormStore } from 'fireborm'
import { FC, useEffect, useState } from 'react'
import { TbDotsVertical, TbFilter, TbPlus, TbSearch } from 'react-icons/tb'
import { useParams } from 'react-router'
import { CollectionData } from '../types/collection'
import { SchemaProperty } from '../types/schema'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	const { col_id } = useParams()
	const [fireborm] = useAppState<Fireborm>('fireborm')
	const [collections] = useAppState<CollectionData[]>('collections')
	const collection = collections.find(x => x.path === col_id)
	const [rows, setRows] = useState<any[]>([])
	const [headers, setHeaders] = useState<SchemaProperty[]>([])

	useEffect(() => {
		setRows([])
		setHeaders([])
		if (!collection) return
		setHeaders(getTableHeads(collection))
		const store = fireborm.createStore({
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
		})
		store.subscribeMany({ where: [], onChange: setRows })
	}, [collection])

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
						<Menu.Label>Collection options</Menu.Label>
						<Menu.Item>Edit</Menu.Item>
						<Menu.Item>Delete Collection</Menu.Item>
						<Menu.Item>Standardize</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Button variant='light' leftSection={<TbPlus />}>
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
						<Menu.Item>Edit</Menu.Item>
						<Menu.Item>Delete Collection</Menu.Item>
						<Menu.Item>Standardize</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Flex>
			{/* Replace with https://v2.mantine-react-table.com/ */}
			<Table
				highlightOnHover
				withColumnBorders
				stickyHeader
				stickyHeaderOffset={60}
				verticalSpacing='xs'>
				<Table.Thead>
					<Table.Tr>
						{headers.map(header => (
							<Table.Th key={header.id}>
								{header.label}
								{' ['}
								{[header.sortable && 'S', header.filterable && 'F']
									.filter(x => x)
									.join('-')}
								{']'}
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{rows.map(row => (
						<Table.Tr key={row.id}>
							{headers.map(header => (
								<Table.Td key={`${row.id}-${header.id}`}>
									{row[header.name]}
								</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</div>
	)
}

const getTableHeads = (collection: CollectionData) => {
	return collection.schema.filter(x => x.show)
}
