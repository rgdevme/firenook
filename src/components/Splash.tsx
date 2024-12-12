import { Navigate } from 'react-router'
import { useAppConfig } from '../firebase'
import { Path } from '../routes'

export const Splash = () => {
	const { loading, user } = useAppConfig()

	return loading ? (
		<div>Loading</div>
	) : user ? (
		<Navigate to={Path.DASHBOARD} replace />
	) : (
		<Navigate to={Path.LOGIN} replace />
	)
}
