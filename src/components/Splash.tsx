import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const Splash = ({ loading }: { loading: boolean }) => {
	const nav = useNavigate()
	useEffect(() => {
		if (loading) return
		setTimeout(() => nav('login', { replace: true }), 1000)
	}, [loading])

	return <div>Loading</div>
}
