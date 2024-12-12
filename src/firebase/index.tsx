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
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react'

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
}

const appConfigCtxValue = {} as {
	fireborm?: ReturnType<typeof FireBorm>
	auth?: Auth
	user?: User
	loading: boolean
}

const appConfigCtx = createContext(appConfigCtxValue)

export const AppConfigProvider = ({
	config,
	useEmulator = false,
	children
}: PropsWithChildren<AppConfigProps>) => {
	const [fireborm, setFb] = useState<ReturnType<typeof FireBorm>>()
	const [auth, setAuth] = useState<Auth>()
	const [loading, toggle] = useToggle(true)
	const [user, setIsAuthenticated] = useState<User>()

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
			value={{ fireborm, auth, user, loading }}
			children={children}
		/>
	)
}

export const useAppConfig = () => useContext(appConfigCtx)
