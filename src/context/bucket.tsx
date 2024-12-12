import { useList } from '@uidotdev/usehooks'
import { equals } from 'ramda'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useBucketStore } from '../firebase/models/Bucket'
import { BucketData } from '../firebase/types/Bucket'

const BucketsCtx = createContext({
	buckets: [] as BucketData[],
	create: (async () => {}) as (data: BucketData) => Promise<void>,
	remove: (async () => {}) as (data: BucketData) => Promise<void>
})

export const BucketsProvider = ({ children }: PropsWithChildren) => {
	const [results, { set }] = useList<BucketData>()
	const store = useBucketStore()

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
