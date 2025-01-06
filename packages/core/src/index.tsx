import { FirebaseOptions } from 'firebase/app'
import { Fireborm, FirebormSettings } from 'fireborm'
import { useAtomValue } from 'jotai'
import { orm, ormReady } from './context'

export const getFireborm = () => orm.get()

export const initializeFirenookConnection = (
	config: FirebaseOptions,
	settings: FirebormSettings
) => {
	orm.set(new Fireborm(config, settings))
}

export interface FirenookProps {
	logo?: string
}

export const Firenook = ({ logo }: FirenookProps) => {
	const ready = useAtomValue(ormReady)

	return ready ? <div>Hello world</div> : <div>Loading</div>
}
