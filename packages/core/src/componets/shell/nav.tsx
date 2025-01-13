import { useAtomValue } from 'jotai'
import { pluginMenu } from '../../context'

export function DoubleNavbar() {
	const menuItems = useAtomValue(pluginMenu.atom)

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
