import { useToggle } from '@uidotdev/usehooks'
import { FirebaseApp } from 'firebase/app'
import { Auth, User } from 'firebase/auth'
import { Firestore } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'
import { FireBorm } from 'fireborm'
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react'
import { AppConfig, FirenookPlugin } from '../types/app'
import { initializePlugins } from '../utils/init'

export type AppConfigProps = {
	app: FirebaseApp
	firestore: Firestore
	storage: FirebaseStorage
	auth: Auth
	logo?: string
	plugins?: FirenookPlugin[]
}

const appConfigCtxValue = {} as AppConfig

const appConfigCtx = createContext(appConfigCtxValue)

export const AppConfigProvider = ({
	logo,
	children,
	auth,
	firestore,
	storage,
	plugins = []
}: PropsWithChildren<AppConfigProps>) => {
	const fireborm = FireBorm({ firestore, storage })
	const [loading, toggleLoadingAuth] = useToggle(true)
	const [params, exposeParams] = useState({})
	const [user, setIsAuthenticated] = useState<User>()

	const {
		PluginsProvider,
		menuItems = [],
		routes = {},
		header = []
	} = initializePlugins(plugins)

	useEffect(() => {
		if (!auth) return
		const unsub = auth.onAuthStateChanged(user => {
			setIsAuthenticated(user ?? undefined)
			toggleLoadingAuth(false)
		})

		return unsub
	}, [auth?.app.options.appId])

	const value = {
		fireborm,
		auth,
		user,
		loading,
		logo,
		params,
		exposeParams
	}

	return (
		<appConfigCtx.Provider value={{ ...value, menuItems, routes, header }}>
			<PluginsProvider app={value}>{children}</PluginsProvider>
		</appConfigCtx.Provider>
	)
}

export const useAppConfig = () => useContext(appConfigCtx)
