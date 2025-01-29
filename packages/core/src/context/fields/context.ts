import { useAtomValue } from 'jotai'
import { getAppState, useAppState } from '../appState'
import { Field, FieldType } from './types'

export const getFields = () => getAppState('firenookFields').get()
export const useFields = () => useAppState('firenookFields')
export const getField = <Key extends FieldType = FieldType>(type: Key) => {
	const fields = getFields()
	if (fields.has(type)) console.warn(`Field '${type}' hasn't been set yet.`)
	return fields.get(type) as FirenookFieldContext[Key] | undefined
}
export const useField = <Key extends FieldType = FieldType>(type: Key) => {
	const fields = useAtomValue(getAppState('firenookFields').atom)
	const field = fields.get(type) as FirenookFieldContext[Key] | undefined
	console.log('useField', type, { field })
	return field
}

export const registerField: (
	field: Field,
	options?: { force?: boolean }
) => void = (field, { force = false } = {}) => {
	const fieldsState = getAppState('firenookFields')
	const fields = fieldsState.get()
	const exists = fields.has(field.type)
	if (exists && !force) {
		console.error(`Field ${field.type} already exists.`)
		return
	} else if (exists && force) {
		console.warn(`Field ${field.type} is being overwritten.`)
	}

	const update = new Map(fields)
	update.set(field.type, field)
	fieldsState.set(update)

	console.log(fields, update, fieldsState.get())
}
