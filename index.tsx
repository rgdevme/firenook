import { createRoot } from 'react-dom/client'
import { Firenook } from './src/index'
import BucketsPlugin from './src/plugins/buckets'
import StoresPlugin from './src/plugins/store'

import logo from './assets/logo.png'

const config = {
	apiKey: 'AIzaSyCHJdqYGjsXWlciLt21lN5i8qheX6tBqoQ',
	authDomain: 'rgdevme.firebaseapp.com',
	projectId: 'rgdevme',
	storageBucket: 'rgdevme.firebasestorage.app',
	messagingSenderId: '615649263196',
	appId: '1:615649263196:web:26c5e77cf3c4f56de1f099',
	measurementId: 'G-7P0LGV13FP'
}

const root = createRoot(document.getElementById('root')!)
root.render(
	<Firenook
		config={config}
		useEmulator={true}
		logo={logo}
		plugins={[StoresPlugin, BucketsPlugin]}
	/>
)
