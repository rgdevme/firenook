// import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router'
// import { authed } from '../../context'
import { Shell } from '../shell'

export const PrivateLayout = () => {
	// const allowed = useAtomValue(authed.atom)
	const allowed = true
	if (!allowed) return <Navigate to={'/login'} replace />
	return <Shell children={<Outlet />} />
}
