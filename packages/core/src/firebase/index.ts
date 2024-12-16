import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
	connectFirestoreEmulator,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

export const initializeFirebase = (config: object, emulate: boolean) => {
	const app = initializeApp(config)
	const auth = getAuth(app)
	const storage = getStorage(app)
	const firestore = initializeFirestore(app, {
		ignoreUndefinedProperties: true,
		localCache: persistentLocalCache({
			tabManager: persistentMultipleTabManager()
		})
	})

	if (emulate) {
		connectAuthEmulator(auth, 'http://127.0.0.1:9099')
		connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
		connectStorageEmulator(storage, '127.0.0.1', 9199)
	}

	return { storage, firestore, auth }
}
