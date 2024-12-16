import { useList } from '@uidotdev/usehooks'
import { useEffect, useMemo } from 'react'
import { FileProperty } from '../../../../../core/src/components/Property/file'
import { FirenookComponent } from '../../../../../core/src/type'
import { useBucketsList } from '../../context/bucket'

export const BucketList: FirenookComponent = ({
	app: {
		params: { bid },
		fireborm
	}
}) => {
	const [results, { set }] = useList<string>()
	const { buckets } = useBucketsList()
	const bucket = useMemo(
		() =>
			!bid || !fireborm
				? null
				: fireborm?.initializeStorage({ path: 'bucket', folder: bid }),
		[bid]
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

	return !bid ? null : (
		<div>
			<h3 className='font-bold text-xl mb-2'>
				{buckets.find(x => x.path === bid)?.name}
			</h3>
			<FileProperty label={bid} value={results} onChange={set} />
		</div>
	)
}