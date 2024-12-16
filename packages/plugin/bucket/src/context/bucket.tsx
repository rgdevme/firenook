import { FirenookProvider } from '@firenook/core/src'
import { useList } from '@uidotdev/usehooks'
import { equals } from 'ramda'
import { createContext, useContext, useEffect } from 'react'
import { initBucketStore } from '../model'
import { BucketData } from '../type'

const BucketsCtx = createContext({
	buckets: [] as BucketData[],
	create: (async () => {}) as (data: BucketData) => Promise<void>,
	remove: (async () => {}) as (data: BucketData) => Promise<void>
})

export const BucketsProvider: FirenookProvider = ({ children, app }) => {
	const [results, { set }] = useList<BucketData>()
	const store = initBucketStore(app.firestore)

	const create = async (data: BucketData) => {
		if (results.some(x => equals(x, data))) return
		const res = await store?.save('buckets', {
			buckets: [...results, data]
		})
		console.log({ res })
	}

	const remove = async (data: BucketData) => {
		if (!results.some(x => equals(x, data))) return
		await store?.save('buckets', {
			buckets: results.filter(x => !equals(x, data))
		})
	}

	useEffect(() => {
		const unsub = store?.subscribe('buckets', {
			onChange: res => {
				if (!res?.buckets) return
				set(res.buckets)
			}
		})
		return () => unsub?.()
	}, [store?.ref.id])

	return (
		<BucketsCtx.Provider
			value={{
				buckets: results,
				create,
				remove
			}}
			children={children}
		/>
	)
}

export const useBucketsList = () => useContext(BucketsCtx)
