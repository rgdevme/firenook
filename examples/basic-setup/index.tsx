import { BucketsPlugin } from '@firenook/bucket'
import { Firenook, initializeFirebase } from '@firenook/core'
import { createRoot } from 'react-dom/client'

import logo from './assets/logo.png'

import '@firenook/core/index.css'

const config = initializeFirebase(
	{
		apiKey: 'AIzaSyCHJdqYGjsXWlciLt21lN5i8qheX6tBqoQ',
		authDomain: 'rgdevme.firebaseapp.com',
		projectId: 'rgdevme',
		storageBucket: 'rgdevme.firebasestorage.app',
		messagingSenderId: '615649263196',
		appId: '1:615649263196:web:26c5e77cf3c4f56de1f099',
		measurementId: 'G-7P0LGV13FP'
	},
	true
)

const root = createRoot(document.getElementById('root')!)
root.render(
	<Firenook {...config} logo={logo} plugins={[BucketsPlugin(config)]} />
)
