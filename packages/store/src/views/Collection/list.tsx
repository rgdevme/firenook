import { FirenookComponent } from '@firenook/core'
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PluginRoutes } from '../..'
import { useCollection } from '../../context/collection'
import { useCollections } from '../../context/collections'
import { PropertyType } from '../../type'

export const List: FirenookComponent = ({ app: { params } }) => {
	const navigate = useNavigate()
	const { cid } = params
	const { current } = useCollections()
	const { list: rows, selection, setSelection } = useCollection()

	const columns = useMemo(
		() => [
			{ key: 'id', name: 'ID', sortable: true, type: PropertyType.string },
			...(current?.schema || [])
				.filter(p => p.show)
				.map(({ key, name, sortable, type }) => ({ key, name, sortable, type }))
		],
		[current?.schema]
	)

	return (
		<div className='flex flex-col gap-3 px-2'>
			<Table
				color='primary'
				className='list'
				selectionMode='multiple'
				selectedKeys={selection}
				onSelectionChange={sel => {
					if (sel !== 'all') setSelection(sel as Set<string>)
					else setSelection(new Set(rows.map(r => r.id)))
				}}
				isStriped
				removeWrapper
				onSortChange={() => rows}
				onRowAction={key => navigate(PluginRoutes.record.build(cid!, key))}
				aria-label='Example static collection table'>
				<TableHeader>
					{columns.map(col => (
						<TableColumn
							data-column='true'
							key={col.key}
							allowsSorting={col.sortable}>
							{col.name}
						</TableColumn>
					))}
				</TableHeader>
				<TableBody
					emptyContent={`No ${current?.plural.toLowerCase()} to display.`}>
					{rows.map(p => (
						<TableRow key={p.id} className='cursor-pointer'>
							{columns.map(col => (
								<TableCell key={col.key}>
									{col.type === PropertyType.timestamp
										? p[col.key]?.toString()
										: p[col.key]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
