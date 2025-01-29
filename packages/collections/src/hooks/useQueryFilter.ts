import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { CollectionSchemaProperty } from '../types/collection'

export const useQueryFilter = (
	schemas: CollectionSchemaProperty[] | undefined = []
) => {
	const initialValues = {
		searchBy: '',
		search: '',
		direction: 'asc' as 'asc' | 'desc',
		order: ''
	}
	const filter = useForm({
		initialValues,
		transformValues: ({ order, ...values }) => ({
			...values,
			order: order.length > 0 ? order : undefined
		})
	})
	const [debounced] = useDebouncedValue(filter.getValues(), 300)

	useEffect(() => {
		const stringFilters = schemas.filter(x => x.type === 'string')
		if (!stringFilters.length) return
		const upd = { searchBy: stringFilters?.[0].keyname }
		filter.setValues(upd)
		filter.setInitialValues({ ...initialValues, ...upd })
		filter.reset()
	}, [schemas])

	return {
		values: filter.getTransformedValues(),
		debounced,
		update: filter.setValues,
		getInputProps: filter.getInputProps
	}
}
