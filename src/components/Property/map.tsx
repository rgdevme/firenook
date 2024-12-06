import { Accordion, AccordionItem, Input, Switch } from '@nextui-org/react'
import { VscSymbolNumeric, VscSymbolString } from 'react-icons/vsc'
import {
	MappedProperty,
	MappedPropertyType
} from '../../firebase/types/Property'
import { useEffect, useState } from 'react'

export const MapProperty = ({
	label,
	value = {},
	schema = [],
	onChange
}: {
	label: string
	value?: object
	schema?: MappedProperty[]
	onChange: (val: object) => void
}) => {
	const [state, setState] = useState(
		Object.fromEntries(
			schema.map(prop => [prop.key, value?.[prop.key] || prop.value])
		)
	)

	useEffect(() => {
		console.log({ value, schema, state })
		onChange(state)
	}, [state])

	return (
		<Accordion isCompact variant='bordered' className='bg-white'>
			<AccordionItem key={'1'} aria-label={label} title={label}>
				<div className='flex gap-2 p-4 rounded-lg rounded-t-none'>
					{Object.entries(state).map(([key, value]) => {
						const type = schema.find(x => x.key === key)!.type

						return type === MappedPropertyType.STRING ? (
							<Input
								key={key}
								size='sm'
								label={key}
								defaultValue={value}
								endContent={
									<VscSymbolString size={28} className='text-default-400' />
								}
								onChange={val =>
									setState(p => ({ ...p, [key]: val.target.value }))
								}
							/>
						) : type === MappedPropertyType.NUMBER ? (
							<Input
								key={key}
								type='number'
								size='sm'
								label={key}
								defaultValue={value}
								endContent={
									<VscSymbolNumeric size={28} className='text-default-400' />
								}
								onChange={val =>
									setState(p => ({ ...p, [key]: Number(val.target.value) }))
								}
							/>
						) : (
							<Switch
								key={key}
								defaultSelected={value}
								size='sm'
								onValueChange={val => setState(p => ({ ...p, [key]: val }))}>
								{key}
							</Switch>
						)
					})}
				</div>
			</AccordionItem>
		</Accordion>
	)
}
