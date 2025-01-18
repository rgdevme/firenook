import { MenuItem, useAppState } from '@firenook/core'
import { Menu } from '@mantine/core'
import { FC, useEffect } from 'react'
import { TbFolders, TbPlus } from 'react-icons/tb'
import { Link, matchPath, useLocation } from 'react-router'
import { CollectionData, CollectionStore } from '../types/collection'

export const CollectionMenu: FC = () => {
	const { pathname } = useLocation()
	const [store] = useAppState<CollectionStore>('settingsStore')
	const [collections, setCollections] =
		useAppState<CollectionData[]>('collections')

	useEffect(() => {
		const unsub = store.subscribe('col', {
			onChange: data => {
				setCollections(
					Object.entries(data || {})
						.filter(([k]) => !['id', '_ref'].includes(k))
						.map(([_, v]) => v as (typeof collections)[number])
				)
			}
		})
		return unsub
	}, [])

	return (
		<Menu
			width={200}
			trigger='click-hover'
			loop={false}
			withinPortal={false}
			menuItemTabIndex={0}
			offset={16}
			position='right-start'
			classNames={{
				dropdown: 'shadow-lg'
			}}
			closeDelay={100}>
			<Menu.Target>
				<MenuItem label='Collections' icon={TbFolders} />
			</Menu.Target>

			<Menu.Dropdown>
				{collections.length && (
					<>
						<Menu.Label>Collections</Menu.Label>
						{collections.map(col => (
							<Menu.Item
								key={col.path}
								component={Link}
								to={`/col/${col.path}`}
								data-active={!!matchPath(pathname, `/col/${col.path}`)}
								className='text-sm text-stone-500 *:data-[active=true]:text-sky'>
								{col.plural}
							</Menu.Item>
						))}
						<Menu.Divider />
					</>
				)}
				<Menu.Item
					component={Link}
					to='/col/new'
					data-active={!!matchPath(pathname, `/col/new`)}
					className='text-sm text-stone-500 *:data-[active=true]:text-sky'
					leftSection={<TbPlus />}>
					Add new
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
