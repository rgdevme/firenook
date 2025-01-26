import { GetInputPropsReturnType } from '@mantine/form/lib/types'
import { MRT_Row } from 'mantine-react-table'
import { FC, ReactNode } from 'react'

export enum PropertyType {
	STRING = 'string',
	NUMBER = 'number'
}

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
	type: PropertyType
}

export interface StringPropertySchema extends BasePropertySchema {
	type: PropertyType.STRING
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
	cell: FC<CellProps<StringPropertySchema>>
}

export interface NumberPropertySchema extends BasePropertySchema {
	type: PropertyType.NUMBER
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
	cell: FC<CellProps<NumberPropertySchema>>
}

export type PropertySchema =
	| BasePropertySchema
	| StringPropertySchema
	| NumberPropertySchema

type FieldProps<P extends PropertySchema> = Omit<
	P,
	'element' | 'filter' | 'cell'
> & {
	dirty: boolean
	submitting: boolean
	inputProps: GetInputPropsReturnType
}

type CellProps<P extends PropertySchema> = {
	row: MRT_Row<any>
	property: Omit<P, 'element' | 'filter' | 'cell'>
	actions?: ReactNode
}
