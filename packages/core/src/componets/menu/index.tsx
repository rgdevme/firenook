import { Button, Menu } from '@mantine/core'
import { PropsWithChildren } from 'react'
import { IconType } from 'react-icons'
import { useAppState } from '../../context'

export const MenuDivider = Menu.Divider
export const MenuItem = Menu.Item

export const MenuSection = ({
	active = false,
	icon: Icon,
	label,
	children
}: PropsWithChildren<{
	active?: boolean
	icon: IconType
	label: string
}>) => {
	const [opened] = useAppState<boolean>('menuState')

	return (
		<Menu
			width={200}
			trigger='click-hover'
			loop={false}
			withinPortal={false}
			menuItemTabIndex={0}
			offset={16}
			position='right-start'
			classNames={{
				dropdown: 'shadow-lg'
			}}
			closeDelay={100}>
			<Menu.Target>
				<Button
					color={active ? 'sky' : 'stone'}
					variant='subtle'
					fullWidth
					className='flex flex-row flex-nowrap gap-[6%] items-center p-2 min-w-9 text-sm font-normal'
					classNames={{ label: 'flex-1', inner: 'w-full justify-start' }}
					leftSection={<Icon size={22} strokeWidth={1.5} />}>
					{label}
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				{children && (
					<>
						{!opened && <Menu.Label>{label}</Menu.Label>}
						{children}
					</>
				)}
			</Menu.Dropdown>
		</Menu>
	)
}
