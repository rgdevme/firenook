import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { CollectionSchemaForm } from '../types/collection'

export const useQueryFilter = (
	schema: CollectionSchemaForm[] | undefined = []
) => {
	const initialValues = {
		searchBy: '',
		search: '',
		direction: 'asc' as 'asc' | 'desc',
		order: undefined as string | undefined
	}

	const filter = useForm({
		initialValues,
		enhanceGetInputProps: ({ form, field }) => ({
			defaultValue: undefined,
			value: form.getValues()[field]
		})
	})
	const [debounced] = useDebouncedValue(filter.getValues(), 300)

	useEffect(() => {
		const stringFilters = schema.filter(x => x.type === 'string')
		if (!stringFilters.length) return
		const upd = { searchBy: stringFilters?.[0].keyname }
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
