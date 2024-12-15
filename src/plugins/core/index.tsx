import { Button } from '@nextui-org/react'
import { FunctionComponent, PropsWithChildren } from 'react'
import { Link } from 'react-router'
import { AppConfig } from '../../context'

export type FirenookProvider = FunctionComponent<
	PropsWithChildren<{
		app: AppConfig
	}>
>

export type FirenookComponent = FunctionComponent<{
	app: AppConfig
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
	name: Lowercase<`fn-${string}-plugin`>
	routes?: FirenookElements
	menuItems?: FunctionComponent
	header?: FunctionComponent
	provider?: FirenookProvider
}

export type FirenookPlugin = (
	fireborm: AppConfig['fireborm']
) => FirenookPluginProps

export const FirenookMenuItem = ({
	path,
	label
}: {
	path: string
	label: string
}) => {
	return (
		<Button
			size='sm'
			as={Link}
			to={path}
			variant='light'
			color='primary'
			className='justify-start'>
			{label}
		</Button>
	)
}
