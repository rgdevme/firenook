import { Menu, MenuItemProps } from '@mantine/core'
import { Link } from 'react-router'

export const MenuLink = ({
	to,
	active = false,
	color,
	label
}: {
	to: string
	active?: boolean
	label: string
	color?: MenuItemProps['color']
}) => (
	<Menu.Item
		component={Link}
		to={to}
		variant={active ? 'light' : 'subtle'}
		color={active ? color ?? 'sky' : 'stone'}
		className='text-sm'>
		{label}
	</Menu.Item>
)
