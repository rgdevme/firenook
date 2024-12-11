import { useList } from '@uidotdev/usehooks'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { fireborm } from '../../firebase'
import { FileProperty } from '../Property/file'
import { useBucketsList } from '../../context/bucket'

export const BucketList = () => {
	const { path } = useParams()
	const [results, { set }] = useList<string>()
	const { buckets } = useBucketsList()
	const bucket = useMemo(
		() => (!path ? null : fireborm.initializeStorage({ path, folder: path })),
		[path]
	)

	useEffect(() => {
		if (!bucket) return
		bucket.list().then(async res => {
			const urlPromises = res.items.map(async item =>
				bucket.download(item.name)
			)
			const urls = await Promise.all(urlPromises)
			set(urls)
		})
	}, [bucket])

	return !path ? null : (
		<div>
			<h3 className='font-bold text-xl mb-2'>
				{buckets.find(x => x.path === path)?.name}
			</h3>
			<FileProperty label={path} value={results} onChange={set} />
		</div>
	)
}
