import { FirenookPluginFunction, registerField } from '@firenook/core'
import { DateField } from './components/date'

import '@mantine/dates/styles.css'

declare global {
	interface FirenookFieldContext {
		date: DateField
	}
}

export const FieldDates: FirenookPluginFunction = () => {
	registerField(DateField)
	return { name: 'field-date' }
}
