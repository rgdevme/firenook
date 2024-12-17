import { FirenookComponent } from '@firenook/core'
import { FileProperty } from '@firenook/core/src/components/Property/file'
import { useList } from '@uidotdev/usehooks'
import { FirebormStorage } from 'fireborm'
import { useEffect, useMemo } from 'react'
import { useBucketsList } from '../../context/bucket'

export const BucketList: FirenookComponent = ({
	app: {
		params: { bid },
		storage
	}
}) => {
	const [results, { set }] = useList<string>()
	const { buckets } = useBucketsList()
	const bucket = useMemo(() => {
		if (!bid) return null
		const s = new FirebormStorage({ path: 'bucket', folder: bid })
		s.init(storage)
		return s
	}, [bid])

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
