import { FirebaseOptions, initializeApp } from '@firebase/app'
import {
	connectFirestoreEmulator,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from '@firebase/firestore'
import { connectStorageEmulator, getStorage } from '@firebase/storage'
import { useToggle } from '@uidotdev/usehooks'
import { Auth, connectAuthEmulator, getAuth, User } from 'firebase/auth'
import { FireBorm } from 'fireborm'
import {
	createContext,
	FunctionComponent,
	MutableRefObject,
	PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { FirenookElements } from '../plugins/core'
import { Params } from 'react-router'

export let fireborm: ReturnType<typeof FireBorm>

export const initFB = async (config: FirebaseOptions, useEmulator = false) => {
	const app = initializeApp(config)
	const auth = getAuth(app)
	const firestore = initializeFirestore(app, {
		ignoreUndefinedProperties: true,
		localCache: persistentLocalCache({
			tabManager: persistentMultipleTabManager()
		})
	})
	const storage = getStorage(app)

	if (useEmulator) {
		connectAuthEmulator(auth, 'http://127.0.0.1:9099')
		connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
		connectStorageEmulator(storage, '127.0.0.1', 9199)
	}

	fireborm = FireBorm({ firestore, storage })
	return app
}

export type AppConfigProps = {
	config: FirebaseOptions
	useEmulator?: boolean
	logo?: string
}

export type AppConfig = {
	fireborm?: ReturnType<typeof FireBorm>
	auth?: Auth
	user?: User
	loading: boolean
	logo?: string
	routes: MutableRefObject<FirenookElements>
	menuItems: Record<string, FunctionComponent>
	params: Params<string>
	exposeParams: (params: Params<string>) => void
	registerRoutes: (elements: FirenookElements) => void
	registerMenuItems: (elements: Record<string, FunctionComponent>) => void
}

const appConfigCtxValue = {} as AppConfig

const appConfigCtx = createContext(appConfigCtxValue)

export const AppConfigProvider = ({
	config,
	useEmulator = false,
	logo,
	children
}: PropsWithChildren<AppConfigProps>) => {
	const [fireborm, setFb] = useState<ReturnType<typeof FireBorm>>()
	const [auth, setAuth] = useState<Auth>()
	const [loading, toggle] = useToggle(true)
	const [user, setIsAuthenticated] = useState<User>()
	const routes = useRef<FirenookElements>({})
	const [params, exposeParams] = useState({})
	const [menuItems, setMenuItems] = useState<Record<string, FunctionComponent>>(
		{}
	)
	const registerRoutes = (elements: FirenookElements) => {
		routes.current = { ...routes.current, ...elements }
	}
	const registerMenuItems = (elements: Record<string, FunctionComponent>) => {
		const upd = { ...menuItems }
		for (const key in elements) {
			upd[key] = elements[key]
		}
		// menuItems.current = { ...upd }
		setMenuItems({ ...upd })
	}

	useEffect(() => {
		toggle(true)
		const app = initializeApp(config)

		const storage = getStorage(app)
		const firestore = initializeFirestore(app, {
			ignoreUndefinedProperties: true,
			localCache: persistentLocalCache({
				tabManager: persistentMultipleTabManager()
			})
		})

		const fb = FireBorm({ firestore, storage })
		const au = getAuth(app)
		setAuth(au)
		setFb(fb)

		if (useEmulator) {
			connectAuthEmulator(au, 'http://127.0.0.1:9099')
			connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
			connectStorageEmulator(storage, '127.0.0.1', 9199)
		}

		const unsub = au.onAuthStateChanged(user => {
			setIsAuthenticated(user ?? undefined)
			toggle(false)
		})
		return unsub
	}, [config])

	return (
		<appConfigCtx.Provider
			value={{
				fireborm,
				auth,
				user,
				loading,
				logo,
				menuItems,
				routes,
				params,
				exposeParams,
				registerMenuItems,
				registerRoutes
			}}
			children={children}
		/>
	)
}

export const useAppConfig = () => useContext(appConfigCtx)
