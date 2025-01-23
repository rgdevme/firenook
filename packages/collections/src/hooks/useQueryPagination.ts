import { MRT_PaginationState as PaginationState } from 'mantine-react-table'
import { useCallback, useState } from 'react'

export const useQueryPagination = ({
	first,
	last
}: {
	first: any
	last: any
}) => {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
		include: false,
		pointer: null as any,
		start: true
	})

	const onPaginationChange = useCallback(
		() => (val: (prev: PaginationState) => PaginationState) => {
			const update = val(pagination)
			const changedLimit = update.pageSize !== pagination.pageSize
			const forward = update.pageIndex >= pagination.pageIndex

			setPagination({
				pageSize: update.pageSize,
				pageIndex: update.pageIndex,
				include: false,
				start: forward,
				pointer: changedLimit ? null : forward ? last : first
			})
		},
		[first, last]
	)

	return [pagination, onPaginationChange] as [
		typeof pagination,
		typeof onPaginationChange
	]
}
