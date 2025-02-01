import { getAppState } from '.'
import { FirenookPlugin } from '../../types'
import { MenuItemElement } from '../app'

export const transformMenuItems = ({
	menu,
	name
}: NonNullable<FirenookPlugin>): MenuItemElement[] => {
	if (!menu) return []
	return Object.entries(menu).map(([id, { element, priority = 10 }]) => ({
		key: `${name}-${id}`,
		element,
		priority
	}))
}

export const registerMenuItem = (item: MenuItemElement) => {
	const menuItemsState = getAppState('menuItems')
	const menuItems = menuItemsState.get()
	const exists = menuItems.some(r => r.key === item.key)
	if (exists) console.warn(`MenuItem "${item.key}" already exists`)
	else menuItemsState.set([...menuItems, item])
}
