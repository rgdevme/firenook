import { Input } from '@nextui-org/react'
import { GeoPoint } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const GeoPointProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value?: GeoPoint
	onChange: (val: GeoPoint) => void
}) => {
	const [lat, setLat] = useState(value?.latitude || 0)
	const [lon, setLon] = useState(value?.longitude || 0)
	const [isInvalid, setInvalid] = useState(false)

	let validate = () => {
		const validLon = z.number().safeParse(lon).success
		const validLat = z.number().safeParse(lat).success
		setInvalid(!validLon || !validLat)
	}

	useEffect(() => onChange(new GeoPoint(lat, lon)), [lat, lon])

	return (
		<div className='flex flex-row gap-4 flex-wrap'>
			<Input
				type='number'
				className='flex-1'
				size='sm'
				isInvalid={isInvalid}
				color={isInvalid ? 'danger' : 'default'}
				label={`${label}'s latitude`}
				value={lat.toString()}
				onChange={val => {
					let n = 0
					if (val.target.value.length) {
						n = Number(val.target.value)
					}
					setLat(n)
				}}
				onBlur={validate}
			/>
			<Input
				type='number'
				className='flex-1'
				size='sm'
				isInvalid={isInvalid}
				color={isInvalid ? 'danger' : 'default'}
				label={`${label}'s longitude`}
				value={lon.toString()}
				onChange={val => {
					let n = 0
					if (val.target.value.length) {
						n = Number(val.target.value)
					}
					setLon(n)
				}}
				onBlur={validate}
			/>
		</div>
	)
}
