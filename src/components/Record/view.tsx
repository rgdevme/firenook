import { useEffect } from 'react'
import { useRecord } from '../../context/record'
import { RecordProperties } from './properties'

export const RecordView = () => {
	const { subscribe, update, loading, original } = useRecord()

	useEffect(() => {
		if (!subscribe) return
		console.log('subscribing record')
		const unsub = subscribe()
		return unsub ? unsub : () => {}
	}, [subscribe])

	return loading && original.current ? null : (
		<div className='flex flex-col gap-4 max-w-screen-lg m-auto'>
			<h2>{original.current.id}</h2>
			<div className='flex flex-col gap-4 pb-12'>
				<RecordProperties record={original.current} onChange={update} />
			</div>
		</div>
	)
}
