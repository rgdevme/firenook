import { useEffect } from 'react'
import {
	Navigate,
	Outlet,
	useLocation,
	useParams,
	useSearchParams
} from 'react-router'
import { useParamsContext } from '../context/params'
import { ContainerMain } from './ContainerMain'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'

export const Private = ({ auth: { isAuthenticated } }) => {
	const { pathname } = useLocation()
	const params = useParams()
	const { exposeParams } = useParamsContext()
	const redir = encodeURIComponent(pathname)
	useEffect(() => {
		exposeParams(params)
	}, [params])
	return isAuthenticated ? (
		<>
			<Header />
			<Menu />
			<ContainerMain>
				<Outlet />
			</ContainerMain>
			<Footer />
		</>
	) : (
		<Navigate to={`login?redir=${redir}`} replace />
	)
}

export const SignFlow = ({ authenticated }: { authenticated: boolean }) => {
	const [params] = useSearchParams()
	const redir = params.get('redir') ?? '/dashboard'

	return !authenticated ? (
		<ContainerMain>
			<Outlet />
		</ContainerMain>
	) : (
		<Navigate to={redir} replace />
	)
}
