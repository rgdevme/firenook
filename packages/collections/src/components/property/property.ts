import { GetInputPropsReturnType } from '@mantine/form/lib/types'
import { FC } from 'react'

export interface PropertySchema {
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
	type: string // Modify later
	element: FC<FieldProps<PropertySchema>>
}

type FieldProps<P extends PropertySchema> = Omit<P, 'element'> & {
	dirty: boolean
	submitting: boolean
	inputProps: GetInputPropsReturnType
}

export interface StringPropertySchema extends PropertySchema {
	defaultValue: string
	minLength?: number
	maxLength?: number
	prefix?: string
	suffix?: string
	element: FC<FieldProps<StringPropertySchema>>
}

export interface NumberPropertySchema extends PropertySchema {
	defaultValue: number
	min?: number
	max?: number
	decimals?: undefined | number
	prefix?: string
	suffix?: string
	element: FC<FieldProps<NumberPropertySchema>>
}
