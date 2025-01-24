import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { PropertySchema } from '../components/property/property'

export const useQueryFilter = (schemas: PropertySchema[] | undefined = []) => {
	const filter = useForm({
		initialValues: {
			searchBy: '',
			search: '',
			direction: 'asc' as 'asc' | 'desc',
			order: ''
		},
		transformValues: ({ order, ...values }) => ({
			...values,
			order: order.length > 0 ? order : undefined
		})
	})
	const [debounced] = useDebouncedValue(filter.getValues(), 300)

	useEffect(() => {
		const stringFilters = schemas.filter(x => x.type === 'string')
		if (!stringFilters.length) return
		filter.setValues({ searchBy: stringFilters?.[0].name })
	}, [schemas])

	return {
		values: filter.getTransformedValues(),
		debounced,
		update: filter.setValues,
		getInputProps: filter.getInputProps
	}
}
