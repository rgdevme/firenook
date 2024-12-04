import { useList } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { LuLoader } from 'react-icons/lu'
import { SlCloudUpload } from 'react-icons/sl'
import { useParams } from 'react-router'
import { fireborm } from '../../firebase'

type StoredFile = { name: string; url: string }

export const FileProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value?: string[]
	onChange: (val: string[]) => void
}) => {
	const { collection, record } = useParams()
	const [allFiles, af] = useList<File | StoredFile>(
		(value ?? []).map(url => ({
			name: url.split('/').pop()!,
			url
		}))
	)
	const [storageFiles, sf] = useList<StoredFile>()

	const bucket = collection
		? fireborm.initializeStorage({
				path: collection,
				folder: label.toLowerCase()
		  })
		: null

	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		onDrop: acceptedFiles => {
			acceptedFiles.forEach(af.push)
		}
	})

	const handleFileLists = async () => {
		const [forSf, rest] = allFiles.reduce(
			(arrays, file) => {
				if (storageFiles.some(f => f.name === file.name)) return arrays
				if (file instanceof File) arrays[1].push(file)
				else arrays[0].push(file)
				return arrays
			},
			[[], []] as [StoredFile[], File[]]
		)

		if (forSf.length) sf.set(forSf)
		if (!bucket || !collection || !record) return

		const promises = rest.map(async file => {
			const name = `${record}-${file.name}`
			const url = await bucket.upload(name, file)
			return { url, name }
		})

		const results = await Promise.all(promises)
		results.forEach(sf.push)
	}

	useEffect(() => {
		handleFileLists()
	}, [allFiles])

	useEffect(() => {
		onChange(storageFiles.map(x => x.url))
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => storageFiles.forEach(file => URL.revokeObjectURL(file.url))
	}, [storageFiles])

	return (
		<section className='container'>
			<div
				{...getRootProps()}
				className='flex flex-wrap text-default-400 select-none bg-default-100 cursor-pointer rounded-lg p-2 gap-2'>
				<input {...getInputProps()} />
				{!allFiles.length ? (
					<div className='flex flex-col justify-center items-center w-full min-h-40'>
						<SlCloudUpload size={48} />
						<h3 className='font-bold'>{label}</h3>
						<p>Drag'n drop your files here, or click to select them</p>
					</div>
				) : (
					<>
						{allFiles.map((file, i) => (
							<div
								key={file.name}
								className='min-h-40'
								onClick={async e => {
									e.preventDefault()
									e.stopPropagation()
									if (bucket && !(file instanceof File)) {
										await bucket.remove(file.url)
										URL.revokeObjectURL(file.url)
										af.removeAt(i)
										sf.removeAt(i)
									}
								}}>
								<div className='w-auto h-40 overflow-hidden rounded-lg p-1 border-3 border-dashed border-default-300 hover:border-danger-500 transition'>
									{file instanceof File ? (
										<LuLoader className='animate-spin' />
									) : (
										<img
											src={file.url}
											className='object-cover object-center h-full w-full rounded-md'
											// Revoke data uri after image is loaded
											onLoad={() => URL.revokeObjectURL(file.url)}
										/>
									)}
								</div>
							</div>
						))}
						<div className='h-40 w-28 rounded-lg p-3 border-3 border-dashed border-default-300 flex flex-col gap-2 justify-center items-center text-default-400 text-xs text-center hover:border-primary-300 hover:text-primary-300 transition'>
							<SlCloudUpload size={48} />
							<p>
								Add <strong>{label.toLowerCase()}</strong>
							</p>
						</div>
					</>
				)}
			</div>
		</section>
	)
}
