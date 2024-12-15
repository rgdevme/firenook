import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppConfig } from '../context'
import { Path } from '../routes'

export const Splash = () => {
	const { loading, user } = useAppConfig()
	const [search] = useSearchParams()
	const nav = useNavigate()

	console.log({ user, loading })

	useEffect(() => {
		if (loading) return
		console.log({ user, loading })
		const redir = search.get('redir')
		nav(
			user
				? Path.DASHBOARD
				: redir
				? `${Path.LOGIN}/?redir=${redir}`
				: Path.LOGIN
		)
	}, [loading])

	return <div>Loading</div>
}
