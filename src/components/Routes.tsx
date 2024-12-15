import { equals } from 'ramda'
import { useEffect } from 'react'
import {
	Navigate,
	Outlet,
	useLocation,
	useParams,
	useSearchParams
} from 'react-router'
import { useAppConfig } from '../context'
import { Path } from '../routes'
import { ContainerMain } from './ContainerMain'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'

export const Private = () => {
	const { user, exposeParams, params } = useAppConfig()
	const { pathname } = useLocation()
	const rrparams = useParams()
	const redir = encodeURIComponent(pathname)

	useEffect(() => {
		if (equals(rrparams, params)) return
		exposeParams({ ...rrparams })
	}, [rrparams])

	return user ? (
		<>
			<Header />
			<Menu />
			<ContainerMain>
				<Outlet />
			</ContainerMain>
			<Footer />
		</>
	) : (
		<Navigate to={`/?redir=${redir}`} replace />
		// <Navigate to={'/'} replace />
	)
}

export const SignFlow = () => {
	const { user } = useAppConfig()
	const [params] = useSearchParams()
	const redir = params.get('redir') ?? Path.DASHBOARD

	return !user ? (
		<ContainerMain>
			<Outlet />
		</ContainerMain>
	) : (
		<Navigate to={redir} replace />
	)
}
