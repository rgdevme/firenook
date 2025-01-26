import {
	ActionIcon,
	Button,
	CopyButton,
	Flex,
	Popover,
	Text,
	Tooltip
} from '@mantine/core'
import { useDisclosure, useToggle } from '@mantine/hooks'
import { MRT_Row } from 'mantine-react-table'
import { ReactNode } from 'react'
import { IconType } from 'react-icons'
import { TbCheck, TbKey, TbPencil, TbTrash } from 'react-icons/tb'
import { Link } from 'react-router'
import { PropertySchema } from '../property/property'

export const Cell = ({
	row,
	column,
	actions
}: {
	row: MRT_Row<any>
	column: PropertySchema
	actions?: ReactNode
}) => {
	return (
		<Flex gap='xs' align='center' w='100%' className='[&>*]:flex-1'>
			<div className='flex-1'>
				{column?.cell && <column.cell row={row} property={column} />}
			</div>
			{actions}
		</Flex>
	)
}

export const CellActionEdit = ({ to }: { to: string }) => (
	<Tooltip label='Edit' position='left'>
		<ActionIcon variant='light' size='md' component={Link} to={to}>
			<TbPencil />
		</ActionIcon>
	</Tooltip>
)

export const CellActionCopy = ({
	value,
	icon: Icon = TbKey
}: {
	value: string
	icon?: IconType
}) => (
	<CopyButton value={value} timeout={2000}>
		{({ copied, copy }) => (
			<Tooltip label={copied ? 'ID copied' : 'Copy ID'} position='left'>
				<ActionIcon variant='subtle' color='stone.3' size='md' onClick={copy}>
					{copied ? <TbCheck /> : <Icon />}
				</ActionIcon>
			</Tooltip>
		)}
	</CopyButton>
)

export const CellActionTrash = ({ onClick }: { onClick: Function }) => {
	const [opened, { toggle, open, close }] = useDisclosure()
	const [loading, toggleLoad] = useToggle()

	const onConfirmedClick = async () => {
		toggleLoad(true)
		await onClick()
		toggleLoad(false)
		close()
	}

	return (
		<Popover opened={opened} onChange={toggle}>
			<Popover.Target>
				<Tooltip label='Delete' position='left'>
					<ActionIcon
						variant='light'
						size='md'
						color='rose'
						onClick={open}
						loading={loading}>
						<TbTrash />
					</ActionIcon>
				</Tooltip>
			</Popover.Target>
			<Popover.Dropdown>
				<Text mb='xs'>This action is irreversible</Text>
				<Flex direction='row' gap='xs'>
					<Button onClick={close} disabled={loading}>
						Cancel
					</Button>
					<Button onClick={onConfirmedClick} loading={loading}>
						OK
					</Button>
				</Flex>
			</Popover.Dropdown>
		</Popover>
	)
}
