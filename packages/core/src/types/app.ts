import { Auth, User } from 'firebase/auth'
import { Firestore } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'
import { FunctionComponent, PropsWithChildren } from 'react'
import { Params } from 'react-router'

export type AppConfig = {
	firestore?: Firestore
	storage?: FirebaseStorage
	auth?: Auth
	user?: User
	loading: boolean
	logo?: string
	routes: FirenookElements
	menuItems: FunctionComponent[]
	header: FunctionComponent[]
	params: Params<string>
	exposeParams: (params: Params<string>) => void
}

export type FirenookProvider = FunctionComponent<
	PropsWithChildren<{
		app: {
			firestore?: Firestore
			storage?: FirebaseStorage
			params: Params<string>
		}
	}>
>

export type FirenookComponent = FunctionComponent<{
	app: {
		firestore?: Firestore
		storage?: FirebaseStorage
		params: Params<string>
	}
}>

export class FirenookRoute {
	path: string
	element: FirenookComponent
	build: (...args: string[]) => string
	constructor({ path, element }: { path: string; element: FirenookComponent }) {
		this.path = path
		this.element = element

		this.build = (...args) => {
			const segments = path.split('/')

			const newPath = segments.map(segment => {
				if (segment.startsWith(':')) {
					// const paramName = segment.substring(1)
					return args.shift()
				} else return segment
			})

			return newPath.join('/')
		}
	}
}

export type FirenookElements = { [key: string]: FirenookRoute }

type FirenookPluginProps = {
	name: `fn-${string}-plugin`
	routes?: FirenookElements
	menuItems?: FunctionComponent
	header?: FunctionComponent
	provider?: FirenookProvider
}

export type FirenookPlugin = () => FirenookPluginProps
