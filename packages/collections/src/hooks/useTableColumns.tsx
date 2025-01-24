import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table'
import { FC, useMemo } from 'react'
import { usePropertiesSchemas } from '../components/property/context'
import { PropertySchema } from '../components/property/property'
import { useCurrentCollection } from '../context/collections'

export const useTableColumns = ({
	cell
}: {
	cell: FC<{ row: MRT_Row<any>; first: boolean; column: PropertySchema }>
}) => {
	const collection = useCurrentCollection()
	const idOnly = !collection?.schema.some(x => x.show)
	const schemas = usePropertiesSchemas(collection)

	const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
		if (!collection) return []
		const cols: MRT_ColumnDef<any>[] = idOnly
			? [
					{
						header: 'ID',
						accessorKey: 'id',
						enableSorting: false,
						enableColumnFilter: false,
						enableClickToCopy: true,
						grow: false,
						maxSize: 200,
						minSize: 10
					}
			  ]
			: schemas.map((column, index) => ({
					header: column.label,
					accessorKey: column.name,
					enableSorting: column.sortable,
					enableColumnFilter: column.filterable,
					Cell: ({ row }) => cell({ row, first: index === 0, column })
			  }))

		return cols
	}, [schemas])

	return columns
}
