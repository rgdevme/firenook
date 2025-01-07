import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router'
import { authed, pluginMenu } from '../../context'

export const PublicLayout = () => {
	const allowed = useAtomValue(authed.atom)
	const menu = useAtomValue(pluginMenu.atom)

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
