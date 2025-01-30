import { Where } from 'fireborm'
import { useCallback, useState } from 'react'
import { CollectionSchemaProperty } from '../types/collection'
import { useQueryFilter } from './useQueryFilter'
import { Pointers, useQueryPagination } from './useQueryPagination'

export const useQuery = (
	schemas: CollectionSchemaProperty[] | undefined = []
) => {
	const [count, setCount] = useState(0)
	const [data, setData] = useState([] as any[])

	const [pagination, paginationMethods] = useQueryPagination()
	const [filter, filterMethods] = useQueryFilter(schemas)

	const getQuery = useCallback(() => {
		const { search, searchBy, ...rest } = filter.values

		const where: Where = []

		if (searchBy?.length && search?.length) {
			where.push({
				and: [
					[searchBy, '>=', search],
					[searchBy, '<=', search + '~']
				]
			})
		}

		return {
			where,
			...rest,
			pagination,
			limit: pagination.size,
			order: 'name',
			onChange: ({ data, ...pointers }: { data: any[] } & Pointers) => {
				setData(data)
				paginationMethods.onChangePointers(pointers)
			}
		}
	}, [filter.debounced, pagination.index, pagination.size])

	const result = {
		count,
		data,
		pagination,
		filter
	}

	const methods = {
		getQuery,
		onChangeCount: setCount,
		onChangeData: setData,
		...paginationMethods,
		...filterMethods
	}
	return [result, methods] as [typeof result, typeof methods]
}
