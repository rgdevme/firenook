import { FC } from 'react'

declare global {
	interface FirenookFieldContext {}
}

/** Used to render input fields from the context api. */
export interface Field<
	T = any,
	Static extends FC<any> = FC<any>,
	Input extends FC<any> = FC<any>,
	Filter extends FC<any> = FC<any>
> {
	type: FieldType
	name: string
	defaultValue: T
	static?: Static
	filter?: Filter
	input?: Input
}

export interface FieldInputProps<T = any> {
	defaultValue?: T // Depends on FieldType
	value?: T // Depends on FieldType
	onChange: any
	placeholder?: string
	checked?: boolean
	error?: any
	onFocus?: any
	onBlur?: any
	isDirty?: boolean
	isSubmitting?: boolean
}

export interface FieldBaseProps {
	type: FieldType
	keyname: string
	label?: string
	description?: string
}

/** Used to render input fields from the context api.  */
export interface FieldProps<T = any>
	extends FieldBaseProps,
		FieldInputProps<T> {}

export type FieldType = keyof FirenookFieldContext
export type FieldsContext = Map<FieldType, Field>
