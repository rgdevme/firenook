import { useEffect } from 'react'
import {
	Navigate,
	Outlet,
	useLocation,
	useParams,
	useSearchParams
} from 'react-router'
import { useAppConfig } from '../firebase'
import { Path } from '../routes'
import { ContainerMain } from './ContainerMain'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'

export const Private = () => {
	const { user, exposeParams } = useAppConfig()
	const { pathname } = useLocation()
	const params = useParams()
	const redir = encodeURIComponent(pathname)

	useEffect(() => {
		exposeParams(params)
	}, [params])

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
		<Navigate to={`${Path.LOGIN}?redir=${redir}`} replace />
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
