import { FirebaseOptions } from '@firebase/app'
import { useToggle } from '@uidotdev/usehooks'
import { Auth, User } from 'firebase/auth'
import { FireBorm } from 'fireborm'
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { initializeFirebase } from '../firebase'
import { AppConfig, FirenookPlugin } from '../type'
import { initializePlugins } from '../utils/init'

export type AppConfigProps = {
	config: FirebaseOptions
	useEmulator?: boolean
	logo?: string
	plugins?: FirenookPlugin[]
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
	const [fireborm, setFireBorm] = useState<object>()
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
		const result = initializePlugins(plugins)
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
