import { Flex, Indicator, NumberInput } from '@mantine/core'
import { GeoPoint } from 'firebase/firestore'
import { FC, useEffect, useState } from 'react'
import { TbWorldLatitude, TbWorldLongitude } from 'react-icons/tb'
import { FieldProps } from '../../../context'

export const GeoPointInput: FC<
	FieldProps<GeoPoint> & {
		min?: number
		max?: number
		decimals?: undefined | number
		prefix?: string
		suffix?: string
	}
> = ({
	isDirty,
	isSubmitting,
	label,
	defaultValue,
	value,
	error,
	onChange,
	onFocus,
	onBlur
}) => {
	const [lat, setLat] = useState(value?.latitude || 0)
	const [lon, setLon] = useState(value?.longitude || 0)

	useEffect(() => {
		onChange({ target: { value: new GeoPoint(lat, lon) } })
	}, [lat, lon])

	return (
		<Indicator
			position='top-end'
			size={12}
			withBorder
			disabled={!isDirty}
			processing={isSubmitting}>
			<Flex gap='xs' direction='row'>
				<NumberInput
					size='xs'
					variant='filled'
					flex='1 1 45%'
					label={label}
					placeholder='Latitude'
					max={90}
					min={-90}
					leftSection={<TbWorldLatitude />}
					defaultValue={defaultValue?.latitude}
					value={value?.latitude}
					error={error}
					onChange={v => setLat(v as number)}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<NumberInput
					size='xs'
					variant='filled'
					flex='1 1 45%'
					label={label}
					placeholder='Longitude'
					max={180}
					min={-180}
					leftSection={<TbWorldLongitude />}
					defaultValue={defaultValue?.longitude}
					value={value?.longitude}
					error={error}
					onChange={v => setLon(v as number)}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</Flex>
		</Indicator>
	)
}
