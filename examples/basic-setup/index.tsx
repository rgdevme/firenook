import { BucketsPlugin } from '@firenook/bucket'
import { Firenook, initializeFirebase } from '@firenook/core'
import { createRoot } from 'react-dom/client'
import firebaseConfig from './firebase.config.json'

import '@firenook/core/index.css'
import logo from '../../assets/logo.png'

const config = initializeFirebase(firebaseConfig, true)

const root = createRoot(document.getElementById('root')!)
root.render(
	<Firenook {...config} logo={logo} plugins={[BucketsPlugin(config)]} />
)
