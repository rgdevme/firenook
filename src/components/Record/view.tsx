import { useEffect } from 'react'
import { useCollectionsList } from '../../context/collectionsList'
import { useRecord } from '../../context/record'
import { PropertyType } from '../../firebase/types/Property'
import { NumberProperty } from '../Property/number'
import { StringProperty } from '../Property/string'
import { CheckProperty } from '../Property/check'
import { DateProperty } from '../Property/date'

export const RecordView = () => {
	const { current } = useCollectionsList()
	const record = useRecord()

	useEffect(() => {
		if (!record?.subscribe) return
		const unsub = record.subscribe()
		console.log(unsub)
		return () => {
			unsub()
		}
	}, [record?.subscribe])

	return record.loading ? null : (
		<div className='flex flex-col gap-4 max-w-screen-md m-auto'>
			<h2>{record.data.id}</h2>
			<div className='flex flex-col gap-4'>
				{current?.schema.map(property => {
					let el: JSX.Element | null

					const props = {
						label: property.name,
						type: property.type,
						value: record.data[property.key],
						onChange: (val: any) => record.update({ [property.key]: val })
					}

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

						case PropertyType.markdown:
							el = <DateProperty key={property.key} {...props} />
							break

						default:
							el = null
							break
					}

					return el
				})}
			</div>
		</div>
	)
}
