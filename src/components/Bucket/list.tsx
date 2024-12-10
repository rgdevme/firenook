import { useList } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { fireborm } from '../../firebase'

export const BucketList = () => {
	const { path } = useParams()
	const [results, { set }] = useList<string>()
	const bucket = !path ? null : fireborm.initializeStorage({ path, folder: '' })

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

	return (
		<div>
			{results.map(img => (
				<img key={img} src={img} />
			))}
		</div>
	)
}
