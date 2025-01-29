import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table'
import { FC, useMemo } from 'react'
import { useCollectionDetails } from '../context/collections'
import { CollectionData, CollectionSchemaProperty } from '../types/collection'

export const useTableColumns = ({
	collection,
	Cell
}: {
	collection?: CollectionData
	Cell: FC<{
		row: MRT_Row<any>
		first: boolean
		column: CollectionSchemaProperty
	}>
}) => {
	const { idOnly } = useCollectionDetails(collection)

	const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
		const cols = collection
			? idOnly
				? [idColumnDef]
				: getColumnDefs(collection).map(f => f(Cell))
			: []

		console.log({ collection, idOnly, cols })

		return cols
	}, [collection, idOnly])

	return columns
}

const idColumnDef: MRT_ColumnDef<any> = {
	header: 'ID',
	accessorKey: 'id',
	enableSorting: false,
	enableColumnFilter: false,
	enableClickToCopy: true,
	grow: false,
	maxSize: 200,
	minSize: 10
}

const getColumnDefs = (
	collection: CollectionData
): ((
	Cell: FC<{
		row: MRT_Row<any>
		first: boolean
		column: CollectionSchemaProperty
	}>
) => MRT_ColumnDef<any>)[] => {
	return collection.schema.map((column, index) => Cell => ({
		header: column.label,
		accessorKey: column.keyname,
		enableSorting: column.isSort,
		enableColumnFilter: column.isFilter,
		Cell: ({ row }) => <Cell {...{ row, first: index === 0, column }} />
	}))
}
