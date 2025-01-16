import { getAppState, MenuItem } from '@firenook/core'
import { Menu } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { TbFolders, TbPlus } from 'react-icons/tb'
import { Link, matchPath, useLocation } from 'react-router'
import { CollectionData, CollectionStore } from '../types/collection'

export const CollectionMenu: FC = () => {
	const store = getAppState<CollectionStore>('settingsStore').get()
	const { pathname } = useLocation()
	const [collections, setCollections] = useState<
		Record<string, CollectionData>
	>({})

	useEffect(() => {
		const unsub = store.subscribe('col', {
			onChange: data => {
				setCollections(data ?? {})
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
				<Menu.Label>Collections</Menu.Label>
				{Object.entries(collections).map(([key, value]) =>
					['id', '_ref'].includes(key) ? null : (
						<Menu.Item
							key={key}
							component={Link}
							to={`/col/${key}`}
							data-active={!!matchPath(pathname, `/col/${key}`)}
							className='text-sm text-stone-500 *:data-[active=true]:text-sky'>
							{value.plural}
						</Menu.Item>
					)
				)}
				<Menu.Divider />
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
