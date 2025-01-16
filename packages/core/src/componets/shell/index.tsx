import { AppShell, Burger } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import { Outlet } from 'react-router'
import { useAppState } from '../../context/index'
import { DoubleNavbar } from './nav'

const SIDEBAR_MINW = 56
const SIDEBAR_BP = 'xs'

export const Shell: FC<PropsWithChildren> = () => {
	const [opened, setOpened] = useAppState<boolean>('menuState')
	const toggle = () => setOpened(p => !p)

	return (
		<AppShell
			layout='alt'
			navbar={{
				width: opened ? 220 : SIDEBAR_MINW,
				breakpoint: SIDEBAR_BP,
				collapsed: { mobile: !opened, desktop: !opened }
			}}
			padding='md'>
			<AppShell.Navbar
				visibleFrom={SIDEBAR_BP}
				data-closed={!opened}
				className='data-[closed=true]:translate-x-0 transition-all flex flex-col gap-2 p-2'>
				<Burger
					opened={opened}
					onClick={toggle}
					visibleFrom={SIDEBAR_BP}
					lineSize={1}
					color='sky'
					size='md'
					variant='light'
					className='p-2'
				/>
				<DoubleNavbar />
			</AppShell.Navbar>
			<AppShell.Main
				data-closed={!opened}
				className='transition-all data-[closed=true]:ml-14'>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	)
}
