import { GetInputPropsReturnType } from '@mantine/form/lib/types'
import { FC } from 'react'

export interface BasePropertySchema {
	defaultValue: any // Depends on type
	filterable: boolean
	isArray: boolean
	name: string
	label: string
	description: string
	nullable: boolean
	show: boolean
	side: 'left' | 'right'
	sortable: boolean
	element: FC<any>
	filter?: FC<any>
	cell?: FC<any>
	type: string
}

export interface StringPropertySchema extends BasePropertySchema {
	type: 'string'
	defaultValue: string
	minLength?: number
	maxLength?: number
	prefix?: string
	suffix?: string
	searchable?: boolean
	element: FC<FieldProps<StringPropertySchema>>
	filter: FC<{
		fields: StringPropertySchema[]
		inputProps: GetInputPropsReturnType
	}>
	cell: FC<FieldProps<StringPropertySchema>>
}

export interface NumberPropertySchema extends BasePropertySchema {
	type: 'number'
	defaultValue: number
	min?: number
	max?: number
	decimals?: undefined | number
	prefix?: string
	suffix?: string
	element: FC<FieldProps<NumberPropertySchema>>
	filter: FC<
		NumberPropertySchema & {
			minInputProps: GetInputPropsReturnType
			maxInputProps: GetInputPropsReturnType
		}
	>
	cell: FC<FieldProps<NumberPropertySchema>>
}

export type PropertySchema = StringPropertySchema | NumberPropertySchema

type FieldProps<P> = Omit<P, 'element'> & {
	dirty: boolean
	submitting: boolean
	inputProps: GetInputPropsReturnType
}
