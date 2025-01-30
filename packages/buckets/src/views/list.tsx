import { useListState } from '@mantine/hooks'
import { FC, useEffect } from 'react'
import { useBucket, useBucketStorage } from '../context/buckets'
import { Text } from '@mantine/core'

export const List: FC = () => {
	const bucket = useBucket()
	const storage = useBucketStorage(bucket)
	const [results, { append }] = useListState<string>()

	useEffect(() => {
		if (!storage) return
		storage.list().then(async res => {
			const urlPromises = res.items.map(async item =>
				storage.download(item.name)
			)
			const urls = await Promise.all(urlPromises)
			append(...urls)
		})
	}, [storage])

	return !bucket ? null : (
		<div>
			<h3 className='font-bold text-xl mb-2'>{bucket.name}</h3>
			{results.map((r, i) => (
				<Text key={i}>{r}</Text>
			))}
			{/* <FileProperty label={bid} value={results} onChange={set} /> */}
		</div>
	)
}
