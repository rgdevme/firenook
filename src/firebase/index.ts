import { FirebaseOptions, initializeApp } from '@firebase/app'
import { initializeFirestore } from '@firebase/firestore'
import { getStorage } from '@firebase/storage'
import { FireBorm } from 'fireborm'

export let fireborm: ReturnType<typeof FireBorm>

export const initFB = async (config: FirebaseOptions) => {
	const app = initializeApp(config)
	const firestore = initializeFirestore(app, {
		ignoreUndefinedProperties: true
	})
	const storage = getStorage(app)
	fireborm = FireBorm({ firestore, storage })
	return app
}
