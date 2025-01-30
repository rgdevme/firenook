import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { CollectionSchemaProperty } from '../types/collection'

export const useQueryFilter = (
	schema: CollectionSchemaProperty[] | undefined = []
) => {
	const initialValues = {
		searchBy: '',
		search: '',
		direction: 'asc' as 'asc' | 'desc',
		order: undefined as string | undefined
	}

	const filter = useForm({ initialValues })
	const [debounced] = useDebouncedValue(filter.getValues(), 300)

	useEffect(() => {
		const stringFilters = schema.filter(x => x.type === 'string')
		console.log({ schema, stringFilters })
		if (!stringFilters.length) return
		const upd = { searchBy: stringFilters?.[0].keyname }
		console.log({ upd })

		filter.setValues(upd)
		filter.setInitialValues({ ...initialValues, ...upd })
		filter.reset()
	}, [schema])

	const result = {
		values: filter.values,
		debounced
	}

	const methods = {
		getInputProps: filter.getInputProps
	}

	return [result, methods] as [typeof result, typeof methods]
}
