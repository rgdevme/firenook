import { FirenookPluginFunction, getFireborm } from '@firenook/core'

export const Collections: FirenookPluginFunction = () => {
	const fireborm = getFireborm()

	const store = fireborm.createStore({
		defaultData: {},
		path: 'a',
		plural: 'as',
		singular: 'a'
	})

	console.log({ store })

	return {
		name: 'collections',
		routes: {
			col: () => (
				<div>
					<p>Collections</p>
				</div>
			)
		},
		menu: {
			collections: {
				element: () => <div>Collections menu</div>
			}
		}
	}
}
