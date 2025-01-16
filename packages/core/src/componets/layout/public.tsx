import { Navigate, Outlet } from 'react-router'
import { MenuItemElement } from '../../context/app'
import { useAppState } from '../../context/index'

export const PublicLayout = () => {
	const [allowed] = useAppState<boolean>('authed')
	const [menu] = useAppState<MenuItemElement[]>('menuItems')

	if (allowed) return <Navigate to={'/'} replace />

	return (
		<>
			<div className='menu-items'>
				{menu.map(item => (
					<div key={item.key}>
						<div>
							{item.key} - {item.priority}
						</div>
						<item.element />
					</div>
				))}
			</div>
			<Outlet />
		</>
	)
}
