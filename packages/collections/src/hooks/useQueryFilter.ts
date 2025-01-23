import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useMemo } from 'react'
import { PropertySchema } from '../components/property/property'

export const useQueryFilter = (schemas: PropertySchema[] | undefined = []) => {
	const stringFilters = useMemo(
		() => schemas.filter(x => x.type === 'string'),
		[schemas]
	)

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
		if (!stringFilters?.[0]) return
		filter.setValues({ searchBy: stringFilters?.[0].name })
	}, [stringFilters])

	return {
		values: filter.getTransformedValues(),
		debounced,
		update: filter.setValues,
		getInputProps: filter.getInputProps
	}
}
