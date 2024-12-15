import { FirebaseOptions } from '@firebase/app'
import { useToggle } from '@uidotdev/usehooks'
import { Auth, User } from 'firebase/auth'
import { FireBorm } from 'fireborm'
import {
	createContext,
	FunctionComponent,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { Params } from 'react-router'
import { initializeFirebase } from '../firebase'
import { FirenookElements, FirenookPlugin } from '../plugins/core'
import { initializePlugins } from '../plugins/core/init'

export type AppConfigProps = {
	config: FirebaseOptions
	useEmulator?: boolean
	logo?: string
	plugins?: FirenookPlugin[]
}

export type AppConfig = {
	fireborm?: ReturnType<typeof FireBorm>
	auth?: Auth
	user?: User
	loading: boolean
	logo?: string
	routes: FirenookElements
	menuItems: FunctionComponent[]
	header: FunctionComponent[]
	params: Params<string>
	exposeParams: (params: Params<string>) => void
}

const appConfigCtxValue = {} as AppConfig

const appConfigCtx = createContext(appConfigCtxValue)

export const AppConfigProvider = ({
	config,
	useEmulator = false,
	logo,
	children,
	plugins = []
}: PropsWithChildren<AppConfigProps>) => {
	const [fireborm, setFireBorm] = useState<ReturnType<typeof FireBorm>>()
	const [auth, setAuth] = useState<Auth>()
	const [loadingPlugins, toggleLoadingPlugins] = useToggle(true)
	const [loadingFireBorm, toggleLoadingFireBorm] = useToggle(true)
	const loading = useMemo(
		() => loadingPlugins || loadingFireBorm,
		[loadingFireBorm, loadingPlugins]
	)
	const [params, exposeParams] = useState({})
	const [user, setIsAuthenticated] = useState<User>()

	const { PluginsProvider, menuItems, routes, header } = useMemo(() => {
		toggleLoadingPlugins(true)
		const result = initializePlugins(plugins, fireborm)
		toggleLoadingPlugins(false)
		return result
	}, [plugins, fireborm])

	useEffect(() => {
		toggleLoadingFireBorm(true)
		const firebase = initializeFirebase(config, useEmulator)

		setAuth(firebase.auth)
		setFireBorm(
			FireBorm({
				firestore: firebase.firestore,
				storage: firebase.storage
			})
		)

		const unsub = firebase.auth.onAuthStateChanged(user => {
			setIsAuthenticated(user ?? undefined)
			toggleLoadingFireBorm(false)
		})

		return unsub
	}, [config])

	const app = {
		fireborm,
		auth,
		user,
		loading,
		logo,
		params,
		exposeParams
	}

	return (
		<appConfigCtx.Provider value={{ ...app, menuItems, routes, header }}>
			<PluginsProvider app={app}>{children}</PluginsProvider>
		</appConfigCtx.Provider>
	)
}

export const useAppConfig = () => useContext(appConfigCtx)
