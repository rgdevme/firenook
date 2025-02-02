import { FC } from 'react'

declare global {
	/** Extensible global interface to provide autocompletion. You may extend it like so:
	 * 
	 * @example
	 * declare global {
	 * 	interface FirenookFieldContext {
	 * 	}
} 
	 */
	interface FirenookFieldContext {}
}

/** Used to render input fields from the context api. */
export interface Field<
	Type = any,
	Options extends FieldOptions = {},
	Extra extends Record<string, any> = {}
> {
	type: FieldType
	name: string
	defaultValue: Type
	cell?: FieldCell<Type>
	filter?: FieldFilter<Type, Extra>
	input?: FieldInput<Type, Options, Extra>
	schema?: FieldSchema<Type, Options, Extra>
	options?: { key: keyof Options; value: FC<any> }[]
}

export interface FieldBaseProps {
	type: FieldType
	keyname: string
	label?: string
	description?: string
}
export interface FieldValueProp<T> {
	value: T
}

export interface FieldCellProps<T> {
	item: FieldBaseProps
	input: FieldValueProp<T>
}

export type FieldCell<T> = FC<FieldCellProps<T>>

export interface FieldFilterProps<T, E> extends FieldCellProps<T> {
	extra?: E
	input: {
		value: T
		onChange: any
		placeholder?: string
		error?: any
		onFocus?: any
		onBlur?: any
	}
}

export type FieldFilter<T, E> = FC<FieldFilterProps<T, E>>
export interface FieldOptions {
	[key: string]: any
}

export interface FieldSchemaProps<T, Options extends FieldOptions, E>
	extends FieldFilterProps<T, E> {
	options?: Options
}

export type FieldSchema<T, O extends FieldOptions, E> = FC<
	FieldSchemaProps<T, O, E>
>

/** Defines the status of the field  */
export interface FieldStatusProps {
	isDirty?: boolean
	isSubmitting?: boolean
}
export interface FieldInputProps<T, O extends FieldOptions, E>
	extends FieldSchemaProps<T, O, E> {
	status: FieldStatusProps
}

export type FieldInput<T, O extends FieldOptions, E> = FC<
	FieldInputProps<T, O, E>
>

/** Keys registered in the {@link FirenookFieldContext} type */
export type FieldType = keyof FirenookFieldContext
export type FieldsContext = Map<FieldType, Field>
