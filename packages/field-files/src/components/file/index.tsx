import { Field } from '@firenook/core'
import { FileInput } from './input'

export type FileField = typeof FileField
export type StoredFile = { name: string; url: string; saved: boolean }

export const FileField: Field<
	StoredFile | null,
	{
		maxSize?: number
		maxFiles?: number
		acceptedExtensions?: `.${string[3]}`[]
		onRemove?: (filename: string) => Promise<void>
		onDrop?: (file: File) => Promise<string>
	}
> = {
	type: 'file',
	name: 'File',
	defaultValue: null,
	input: FileInput
}
