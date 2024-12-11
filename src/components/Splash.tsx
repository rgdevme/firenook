import { Navigate } from 'react-router'

export const Splash = ({
	loading,
	authenticated
}: {
	loading: boolean
	authenticated: boolean
}) => {
	return loading ? (
		<div>Loading</div>
	) : authenticated ? (
		<Navigate to='/dashboard' replace />
	) : (
		<Navigate to='/login' replace />
	)
}
