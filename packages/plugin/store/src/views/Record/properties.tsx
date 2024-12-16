import { ArrayProperty } from '@firenook/core/src/components/Property/array'
import { CheckProperty } from '@firenook/core/src/components/Property/check'
import { DateProperty } from '@firenook/core/src/components/Property/date'
import { FileProperty } from '@firenook/core/src/components/Property/file'
import { GeoPointProperty } from '@firenook/core/src/components/Property/geopoint'
import { MapProperty } from '@firenook/core/src/components/Property/map'
import { MarkdownProperty } from '@firenook/core/src/components/Property/markdown'
import { NumberProperty } from '@firenook/core/src/components/Property/number'
import { ReferenceProperty } from '@firenook/core/src/components/Property/reference'
import { StringProperty } from '@firenook/core/src/components/Property/string'
import { Input } from '@nextui-org/react'
import { FunctionComponent, useMemo } from 'react'
import { useCollections } from '../../context/collections'
import { MappedProperty, PropertyDefaultValue, PropertyType } from '../../type'

export type PropertyProps<T = any> = {
	label: string
	type: PropertyType
	value?: T
	schema?: MappedProperty[]
	onChange: (val: T) => void
}

export const RecordProperties = ({
	record = {},
	onChange
}: {
	record?: Record<string, any>
	onChange: (val: Record<string, any>) => void
}) => {
	const { current } = useCollections()
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
			{current?.schema.map(({ key, type, name, elements, isArray }) => {
				let El: FunctionComponent<PropertyProps> | null

				const props = {
					label: name,
					type: type,
					value:
						record[key] ||
						(isArray
							? PropertyDefaultValue[PropertyType.array]
							: PropertyDefaultValue[type]),
					onChange: (val: any) => onChange({ [key]: val })
				} as PropertyProps

				if (isArray) console.log(props.label, props.value, name, record[key])

				switch (type) {
					case PropertyType.string:
					case PropertyType.email:
					case PropertyType.phone:
					case PropertyType.url:
						El = StringProperty
						break
					case PropertyType.number:
						El = NumberProperty
						break

					case PropertyType.boolean:
						El = CheckProperty
						break

					case PropertyType.timestamp:
						El = DateProperty
						break

					case PropertyType.geopoint:
						El = GeoPointProperty
						break

					case PropertyType.reference:
						El = ReferenceProperty
						break

					case PropertyType.markdown:
						El = MarkdownProperty
						break

					case PropertyType.map:
						El = MapProperty
						break

					case PropertyType.file:
					case PropertyType.image:
						El = FileProperty
						break

					default:
						El = null
						break
				}

				return El ? (
					isArray ? (
						<ArrayProperty
							key={key}
							{...props}
							schema={elements}
							element={El}
						/>
					) : (
						<El key={key} {...props} schema={elements!} />
					)
				) : null
			})}
		</>
	)
}
