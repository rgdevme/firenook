import { GeoPoint } from 'firebase/firestore'
import { Field } from '../../../context'
import { GeoPointFilter } from './filter'
import { GeoPointInput } from './input'
import { GeoPointStatic } from './static'

export type GeoPointField = Field<
	GeoPoint,
	typeof GeoPointStatic,
	typeof GeoPointInput,
	typeof GeoPointFilter
>
export const GeoPointField: GeoPointField = {
	type: 'geopoint',
	name: 'GeoPoint',
	defaultValue: new GeoPoint(0, 0),
	filter: GeoPointFilter,
	static: GeoPointStatic,
	input: GeoPointInput
} satisfies Field
