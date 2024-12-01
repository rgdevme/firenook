import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useCollection } from '../../context/collection'
import { useToggle } from '@uidotdev/usehooks'

export const List = () => {
	const [loading, toggleLoading] = useToggle()
	const { store, selection, setSelection } = useCollection()

	const [rows, setRows] = useState<any[]>(
		[]
		// Array(90)
		// 	.fill(null)
		// 	.map(() => ({
		// 		name: 'Tony Reichert',
		// 		position: 'CEO',
		// 		status: 'Active'
		// 	}))
	)

	useEffect(() => {
		if (!store) return
		try {
			toggleLoading(true)
			store.query({ where: [] }).then(setRows)
		} catch (error) {
			console.error(error)
		} finally {
			toggleLoading(false)
		}
	}, [store])

	return (
		<div className='flex flex-col gap-3 px-2'>
			<Table
				color='primary'
				selectionMode='multiple'
				selectedKeys={selection}
				onSelectionChange={sel => setSelection(sel as typeof selection)}
				isStriped
				removeWrapper
				onSortChange={() => rows}
				onRowAction={key => console.log(`Opening item ${key}...`)}
				aria-label='Example static collection table'>
				<TableHeader>
					<TableColumn allowsSorting>NAME</TableColumn>
				</TableHeader>
				<TableBody>
					{...rows.map(p => (
						<TableRow key={p.id} className='cursor-pointer'>
							<TableCell>{p.id}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
