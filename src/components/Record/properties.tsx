import { Input } from '@nextui-org/react'
import { useCollectionsList } from '../../context/collectionsList'
import {
	PropertyDefaultValue,
	PropertyType
} from '../../firebase/types/Property'
import { CheckProperty } from '../Property/check'
import { DateProperty } from '../Property/date'
import { FileProperty } from '../Property/file'
import { GeoPointProperty } from '../Property/geopoint'
import { MarkdownProperty } from '../Property/markdown'
import { NumberProperty } from '../Property/number'
import { ReferenceProperty } from '../Property/reference'
import { StringProperty } from '../Property/string'
import { useMemo } from 'react'

export const RecordProperties = ({
	record = {},
	onChange
}: {
	record?: Record<string, any>
	onChange: (val: Record<string, any>) => void
}) => {
	const { current } = useCollectionsList()
	const disableId = useMemo(() => !!record.id, [record])

	return (
		<>
			{!disableId && current?.customId && (
				<Input
					label='ID'
					disabled={disableId}
					value={record.id}
					onChange={val => onChange({ id: val.target.value })}
				/>
			)}
			{current?.schema.map(property => {
				let el: JSX.Element | null

				const props = {
					label: property.name,
					type: property.type,
					value: record[property.key] ?? PropertyDefaultValue[property.type],
					onChange: (val: any) => onChange({ [property.key]: val })
				}

				console.log(props.value)

				switch (property.type) {
					case PropertyType.string:
					case PropertyType.email:
					case PropertyType.phone:
					case PropertyType.url:
						el = <StringProperty key={property.key} {...props} />
						break
					case PropertyType.number:
						el = <NumberProperty key={property.key} {...props} />
						break

					case PropertyType.boolean:
						el = <CheckProperty key={property.key} {...props} />
						break

					case PropertyType.timestamp:
						el = <DateProperty key={property.key} {...props} />
						break

					case PropertyType.geopoint:
						el = <GeoPointProperty key={property.key} {...props} />
						break

					case PropertyType.reference:
						el = <ReferenceProperty key={property.key} {...props} />
						break

					case PropertyType.markdown:
						el = <MarkdownProperty key={property.key} {...props} />
						break

					case PropertyType.file:
					case PropertyType.image:
						el = <FileProperty key={property.key} {...props} />
						break

					default:
						el = null
						break
				}

				return el
			})}
		</>
	)
}
