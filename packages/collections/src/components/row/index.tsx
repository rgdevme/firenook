import { Field, getField } from '@firenook/core'
import { Checkbox, Flex, Table } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { ReactNode } from 'react'
import { CollectionSchemaForm } from '../../types/collection'
import { transformFormToSchema } from '../../context/collections'

export const TableRow = ({
	item,
	selected,
	schema,
	onSelect,
	actions
}: {
	item: Record<string, any>
	schema: CollectionSchemaForm[]
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
				const field = getField(s.type) as Field
				const schemaProps = transformFormToSchema(s)
				schemaProps.input.value = item[s.keyname]
				return !field?.cell ? null : (
					<Table.Td key={`${item.id}-${s.keyname}`} colSpan={1} maw={25 * 16}>
						<Flex direction='row' wrap='nowrap' align='center'>
							<field.cell {...schemaProps} />
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
