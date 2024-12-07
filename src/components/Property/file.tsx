import { useCounter, useList } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { LuLoader } from 'react-icons/lu'
import { SlCloudUpload } from 'react-icons/sl'
import { useParams } from 'react-router'
import { fireborm } from '../../firebase'
import { FirebaseError } from 'firebase/app'

type StoredFile = { name: string; url: string; saved: boolean }

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
	const [count, { increment, decrement }] = useCounter()
	const [storageFiles, sf] = useList<StoredFile>(
		(value ?? []).map(url => ({
			name: decodeURIComponent(url).split('/').pop()!.split('?')[0],
			url,
			saved: true
		}))
	)

	const bucket = collection
		? fireborm.initializeStorage({
				path: collection,
				folder: label.toLowerCase()
		  })
		: null

	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		onDrop: acceptedFiles => {
			acceptedFiles.forEach(async file => {
				const name = `${record}-${file.name}`
				if (!bucket || !collection || !record) return
				if (storageFiles.some(f => f.name === name)) return
				console.log({ storageFiles, name })

				increment()
				const url = await bucket.upload(name, file)
				sf.push({ name, url, saved: false })
				decrement()
			})
		}
	})

	useEffect(() => {
		if (!value) return
		sf.set(
			value.map(url => ({
				name: decodeURIComponent(url).split('/').pop()!.split('?')[0],
				url,
				saved: true
			}))
		)
	}, [value])

	useEffect(() => {
		onChange(storageFiles.map(x => x.url))
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => {
			storageFiles.forEach(file => URL.revokeObjectURL(file.url))
		}
	}, [storageFiles])

	return (
		<section className='container'>
			<div
				{...getRootProps()}
				className='flex flex-wrap text-default-400 select-none bg-default-100 cursor-pointer rounded-lg p-2 gap-2'>
				<input {...getInputProps()} />
				{storageFiles.length + count == 0 ? (
					<div className='flex flex-col justify-center items-center w-full min-h-40'>
						<SlCloudUpload size={48} />
						<h3 className='font-bold'>{label}</h3>
						<p>Drag'n drop your files here, or click to select them</p>
					</div>
				) : (
					<>
						{storageFiles.map((file, i) => (
							<div
								key={file.name}
								className='min-h-40'
								onClick={async e => {
									e.preventDefault()
									e.stopPropagation()
									if (!bucket) return
									try {
										await bucket.remove(file.name)
										URL.revokeObjectURL(file.url)
										sf.removeAt(i)
									} catch (error) {
										if (
											(error as FirebaseError).code ===
											'storage/object-not-found'
										) {
											URL.revokeObjectURL(file.url)
											sf.removeAt(i)
										}
										console.error(error)
									}
								}}>
								<div className='w-auto max-w-40 h-40 overflow-hidden rounded-lg p-1 border-3 border-dashed border-default-300 hover:border-danger-500 transition'>
									<img
										src={file.url}
										alt={file.name}
										className='object-cover object-center h-full w-full rounded-md'
										// Revoke data uri after image is loaded
										onLoad={() => URL.revokeObjectURL(file.url)}
									/>
								</div>
							</div>
						))}
						{Array(count)
							.fill(null)
							.map((x, i) => (
								<div key={i} className='w-20 h-20'>
									<LuLoader />
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
