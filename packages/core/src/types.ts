import { FC } from 'react'

export type FirenookPluginFunction = () =>
	| FirenookPlugin
	| Promise<FirenookPlugin>

export interface FirenookPlugin {
	name: string
	menu?: { [id: string]: { element: FC; priority?: number } }
	routes?: { [route: string]: FC }
}
