import { FirebaseOptions, initializeApp } from '@firebase/app'
import {
	connectFirestoreEmulator,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from '@firebase/firestore'
import { connectStorageEmulator, getStorage } from '@firebase/storage'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { FireBorm } from 'fireborm'

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
