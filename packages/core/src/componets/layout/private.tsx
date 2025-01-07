import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router'
import { authed } from '../../context'

export const PrivateLayout = () => {
	const allowed = useAtomValue(authed.atom)

	if (!allowed) return <Navigate to={'/login'} replace />

	return <Outlet />
}
