import { useEffect } from 'react'
import { useRecord } from '../../context/record'
import { RecordProperties } from './properties'

export const RecordView = () => {
	const { subscribe, update, loading, original } = useRecord()

	useEffect(() => {
		if (!subscribe) return
		const unsub = subscribe()
		return unsub ? unsub : () => {}
	}, [subscribe])

	return loading && original ? null : (
		<div className='flex flex-col gap-4 max-w-screen-lg m-auto'>
			<h2>{original.id}</h2>
			<div className='flex flex-col gap-4 pb-12'>
				<RecordProperties record={original} onChange={update} />
			</div>
		</div>
	)
}
