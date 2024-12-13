import { Button } from '@nextui-org/react'
import { FunctionComponent, PropsWithChildren } from 'react'
import { Link } from 'react-router'
import { AppConfig } from '../../firebase'

export type FirenookProvider = FunctionComponent<
	PropsWithChildren<{
		app: AppConfig
	}>
>

export type FirenookComponent = FunctionComponent<{
	app: AppConfig
}>

export type FirenookElement = {
	path: string
	name: string
	element: FirenookComponent
	menuElement?: FirenookComponent
}

export type FirenookElements = Record<string, FirenookElement>

type FirenookPluginProps = {
	name: Lowercase<`fn-${string}-plugin`>
	routes?: FirenookElements
	menuItems?: FunctionComponent[]
	provider?: FirenookProvider
}

export type FirenookPlugin = (config: AppConfig) => FirenookPluginProps

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
