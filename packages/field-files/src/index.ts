import { FirenookPluginFunction, registerField } from '@firenook/core'
import { FileField } from './components/file'

declare global {
	interface FirenookFieldContext {
		file: FileField
	}
}

export const FieldFiles: FirenookPluginFunction = () => {
	registerField(FileField)
	return { name: 'field-files' }
}
