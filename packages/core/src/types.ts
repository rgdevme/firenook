import { FC } from 'react'

export type PluginFunction = () => Plugin

export interface Plugin {
	name: string
	menu?: { [id: string]: { element: FC; priority?: number } }
	routes?: { [route: string]: FC }
}
