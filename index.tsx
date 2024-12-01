import { initFB } from './src/firebase'

initFB({
	apiKey: 'AIzaSyCHJdqYGjsXWlciLt21lN5i8qheX6tBqoQ',
	authDomain: 'rgdevme.firebaseapp.com',
	projectId: 'rgdevme',
	storageBucket: 'rgdevme.firebasestorage.app',
	messagingSenderId: '615649263196',
	appId: '1:615649263196:web:26c5e77cf3c4f56de1f099',
	measurementId: 'G-7P0LGV13FP'
}).then(async app => {
	const { createRoot } = await import('react-dom/client')
	const { Firenook } = await import('./src/index')

	const root = createRoot(document.getElementById('root')!)
	root.render(<Firenook app={app} />)
})
