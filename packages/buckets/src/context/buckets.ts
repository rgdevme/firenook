import { registerAppState, useAppState } from '@firenook/core'
import { equals } from 'ramda'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { BucketData, BucketModel, BucketStore } from './types'

declare global {
	interface FirenookAppStateContext {
		buckets: BucketData[]
	}
}

export const createContext = () => {
	registerAppState('buckets', [], true)
}

export const useBucketsStore = () => {
	const [fireborm] = useAppState('fireborm')

	const store = useMemo(() => {
		return fireborm.createStore({
			singular: 'Bucket',
			plural: 'Buckets',
			path: '_settings',
			defaultData: {},
			toDocument: ({ _ref, id, ...doc }) => doc,
			toModel: doc => {
				const { id, ref } = doc
				const data = doc.data()
				return { id, _ref: ref, ...data } as BucketModel
			}
		}) as BucketStore
	}, [fireborm])

	return store
}

export const useBucket = (id?: string) => {
	const { buc_id } = useParams()
	const [buckets] = useAppState('buckets')
	const target = id || buc_id
	const bucket = target
		? buckets.find(b => getAsParam(b) === target)
		: undefined

	return bucket
}

export const useBucketStorage = (data: BucketData | undefined) => {
	const [fireborm] = useAppState('fireborm')
	const storage = useMemo(
		() =>
			!data
				? undefined
				: fireborm.createStorage({
						path: data.path,
						bucket: data.bucket ?? undefined
				  }),
		[fireborm, data]
	)
	return storage
}

export const useBuckets = () => {
	const [results] = useAppState('buckets')
	const store = useBucketsStore()

	const create = async (data: BucketData) => {
		if (results.some(x => equals(x, data))) return
		await store?.save('buckets', { [data.path]: data } as any)
	}

	const remove = async (data: BucketData) => {
		if (!results.some(x => equals(x, data))) return
		await store?.save(data.path, { [data.path]: undefined })
	}

	return { create, remove, getAsParam }
}

const getAsParam = (data: BucketData) =>
	!!data.path.length ? `${data.bucket ?? 'default'}-${data.path}` : undefined
