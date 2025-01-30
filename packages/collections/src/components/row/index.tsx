import { getField } from '@firenook/core'
import { Checkbox, Flex, Table } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { ReactNode } from 'react'
import { CollectionSchemaProperty } from '../../types/collection'

export const TableRow = ({
	item,
	selected,
	schema,
	onSelect,
	actions
}: {
	item: Record<string, any>
	schema: CollectionSchemaProperty[]
	selected: boolean
	onSelect: (val: boolean) => void
	actions: ReactNode[]
}) => {
	const { ref, hovered } = useHover()
	return (
		<Table.Tr ref={ref} bg={selected ? 'sky.1' : undefined}>
			<Table.Td>
				<Checkbox
					aria-label='Select row'
					checked={selected}
					onChange={event => onSelect(event.currentTarget.checked)}
				/>
			</Table.Td>
			{schema.map((s, i) => {
				const field = getField(s.type)
				return !field?.static ? null : (
					<Table.Td key={`${item.id}-${s.keyname}`}>
						<Flex direction='row' wrap='nowrap' align='center'>
							<field.static
								value={item[s.keyname]}
								keyname={s.keyname}
								type={field.type}
								onChange={undefined}
							/>
							{i === 0 && (
								<Flex
									flex='1 1 auto'
									direction='row'
									wrap='nowrap'
									justify='flex-end'
									opacity={hovered ? 1 : 0}
									style={{
										transition: 'opacity 150ms',
										pointerEvents: hovered ? 'auto' : 'none',
										visibility: hovered ? 'visible' : 'hidden'
									}}
									gap='xs'>
									{...actions}
								</Flex>
							)}
						</Flex>
					</Table.Td>
				)
			})}
		</Table.Tr>
	)
}
