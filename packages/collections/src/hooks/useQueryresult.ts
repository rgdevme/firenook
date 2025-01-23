import { Where } from 'fireborm'
import { useEffect, useState } from 'react'
import { useCollectionStore } from '../context/collections'
import { useQueryPagination } from './useQueryPagination'
import { useQueryFilter } from './useQueryFilter'

export const useQueryResult = () => {
	const { collection, store } = useCollectionStore()

	const [state, setState] = useState({
		data: [] as any[],
		count: 0,
		first: null as any,
		last: null as any
	})

	const filter = useQueryFilter(collection?.schema)
	const [pagination, onPaginationChange] = useQueryPagination({
		first: state.first,
		last: state.last
	})

	useEffect(() => {
		if (!store) return

		const { search, searchBy, ...rest } = filter.values

		const where: Where = []

		if (searchBy.length && search.length) {
			where.push({
				and: [
					[searchBy, '>=', search],
					[searchBy, '<=', search + '~']
				]
			})
		}

		store.count(where).then(count => setState(p => ({ ...p, count })))
		store.subscribeMany({
			where,
			...rest,
			pagination,
			limit: pagination.pageSize,
			order: 'name',
			onChange: res => setState(p => ({ ...p, ...res }))
		})
	}, [store, filter.debounced, pagination])

	const result = {
		...state,
		filter: {
			values: filter.values,
			debounced: filter.debounced
		},
		pagination: {
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize
		}
	}
	const methods = {
		onPaginationChange,
		updateFilter: filter.update,
		getInputProps: filter.getInputProps
	}
	return [result, methods] as [typeof result, typeof methods]
}
