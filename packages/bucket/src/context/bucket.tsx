import { FirenookProvider } from '@firenook/core'
import { useList } from '@uidotdev/usehooks'
import { FirebormStore } from 'fireborm'
import { equals } from 'ramda'
import { createContext, useContext, useEffect } from 'react'
import { BucketData } from '../types/Bucket'

const BucketsCtx = createContext({
	buckets: [] as BucketData[],
	create: (async () => {}) as (data: BucketData) => Promise<void>,
	remove: (async () => {}) as (data: BucketData) => Promise<void>
})

export const BucketsProvider = ({
	children,
	store
}: Parameters<FirenookProvider>[0] & { store?: FirebormStore }) => {
	const [results, { set }] = useList<BucketData>()

	const create = async (data: BucketData) => {
		if (results.some(x => equals(x, data))) return
		await store?.save('buckets', {
			buckets: [...results, data]
		})
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
