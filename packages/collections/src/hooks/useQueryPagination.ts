import { useState } from 'react'

export type Pointers = {
	first: any
	last: any
}
export const useQueryPagination = () => {
	const [pointers, setPointers] = useState<Pointers>({
		first: null,
		last: null
	})
	const [pagination, setPagination] = useState({
		index: 1,
		size: 20,
		include: false,
		pointer: null as any,
		start: true
	})

	const onChangePage = (index: number) => {
		setPagination(prev => {
			const forward = index >= prev.index
			return {
				...prev,
				index,
				start: forward,
				pointer: forward ? pointers.last : pointers.first
			}
		})
	}

	const onChangeSize = (size: string | null) => {
		setPagination(prev => {
			const newSize = size ? Number(size) : 20
			const changedLimit = newSize !== prev.size
			return {
				...prev,
				size: newSize,
				pointer: changedLimit ? null : prev.pointer
			}
		})
	}

	const methods = {
		onChangePage,
		onChangeSize,
		onChangePointers: (val: Pointers) => setPointers(val)
	}

	return [pagination, methods] as [typeof pagination, typeof methods]
}
