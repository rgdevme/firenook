import { Button, Flex, Image, Paper, Text } from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import mime from 'mime-types'
import { ReactNode, useRef, useState } from 'react'
import { Accept } from 'react-dropzone/.'
import { TbDownload, TbFileUpload, TbX } from 'react-icons/tb'
import { FileField } from '.'

export const FileInput: NonNullable<FileField['schema']> = ({
	input,
	// item,
	options: { maxSize, maxFiles, acceptedExtensions = [], onDrop, onRemove } = {}
}) => {
	// const [storageFile, setStorageFile] = useState<StoredFile | null>(input.value)
	const [preview, setPreview] = useState<ReactNode | null>(
		!input.value?.url ? null : (
			<Image
				radius='md'
				w={10.25 * 16}
				h={10.25 * 16}
				src={input.value.url}
				onLoad={() => URL.revokeObjectURL(input.value!.url)}
			/>
		)
	)

	const openRef = useRef<() => void>(null)

	const extensions = acceptedExtensions.map(ext =>
		ext.startsWith('.') ? ext : `.${ext}`
	)
	const accept = extensions.reduce((acceptedMimetypes, ext) => {
		const type = mime.lookup(ext)
		return !type
			? acceptedMimetypes
			: type in acceptedMimetypes
			? { [type]: [...acceptedMimetypes[type], ext] }
			: { [type]: [ext] }
	}, {} as Accept)

	const handleDrop = async ([file]: FileWithPath[]) => {
		console.log('accepted files', { file, onDrop })
		if (!file.path) return

		const imageUrl = URL.createObjectURL(file)
		// let name = file.name
		// setStorageFile({ name, url: file.path, saved: true })
		setPreview(
			<Image
				radius='md'
				w={10.25 * 16}
				h={10.25 * 16}
				src={imageUrl}
				onLoad={() => URL.revokeObjectURL(imageUrl)}
			/>
		)

		if (!onDrop) return
		const url = await onDrop(file)
		// setStorageFile({ name, url, saved: true })
		setPreview(
			<Image
				radius='md'
				w={10.25 * 16}
				h={10.25 * 16}
				src={url}
				onLoad={() => URL.revokeObjectURL(url)}
			/>
		)
	}

	return (
		<Dropzone
			multiple={false}
			openRef={openRef}
			onDrop={handleDrop}
			maxFiles={maxFiles}
			onReject={files => console.log('rejected files', files)}
			maxSize={!maxSize ? undefined : maxSize * 1024 ** 2}
			accept={accept}>
			<Paper
				component={Flex}
				{...({} as any)}
				align='center'
				justify='center'
				p='md'
				gap='xs'
				direction='column'
				bg='gray.1'>
				<Dropzone.Accept>
					<Flex
						style={{ pointerEvents: 'none' }}
						gap='xs'
						justify='center'
						align='center'
						direction='column'
						c='sky'>
						<TbDownload size={72} opacity={0.6} />
						<Text size='sm'>Drop files here</Text>
					</Flex>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<Flex
						style={{ pointerEvents: 'none' }}
						gap='xs'
						justify='center'
						align='center'
						direction='column'
						c='rose'>
						<TbX size={72} opacity={0.6} />
						<Text size='sm'>Pdf file less than 30mb</Text>
					</Flex>
				</Dropzone.Reject>
				<Dropzone.Idle>
					<Flex
						style={{ pointerEvents: 'none' }}
						gap='xs'
						justify='center'
						align='center'
						direction='column'
						c='stone.3'>
						{preview ?? (
							<>
								<TbFileUpload size={72} opacity={0.6} />
								<Text size='sm'>Upload resume</Text>
							</>
						)}
					</Flex>
				</Dropzone.Idle>

				{!preview && (
					<>
						<Text size='sm' c='stone.3'>
							Drag&apos;n&apos;drop files here to upload.
						</Text>
						{!!extensions.length && (
							<Text size='sm' c='stone.3'>
								Allowed extensions: {extensions.join(', ')}.
							</Text>
						)}
						{maxSize && (
							<Text size='sm' c='stone.3'>
								Maximum size: {maxSize}mb.
							</Text>
						)}
						<Button
							// className={classes.control}
							onClick={() => openRef.current?.()}>
							Select files
						</Button>
					</>
				)}
			</Paper>
		</Dropzone>
	)
}
