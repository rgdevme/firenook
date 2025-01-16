import { MenuItemElement } from '../../context/app'
import { useAppState } from '../../context/index'

export function DoubleNavbar() {
	const [menuItems] = useAppState<MenuItemElement[]>('menuItems')

	return (
		<nav>
			<div className='flex flex-col gap-2'>
				{menuItems.map(item => (
					<item.element key={item.key} />
				))}
			</div>
		</nav>
	)
}
