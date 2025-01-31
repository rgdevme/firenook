import {
	MenuDivider,
	MenuEmptyState,
	MenuItem,
	MenuLink,
	MenuSection,
	useAppState
} from '@firenook/core'
import { FC, useEffect } from 'react'
import { TbFolders, TbPlus } from 'react-icons/tb'
import { Link, matchPath, useLocation } from 'react-router'

export const CollectionMenu: FC = () => {
	const { pathname } = useLocation()
	const [store] = useAppState('settingsStore')
	const [collections, setCollections] = useAppState('collections')

	const paths = [...collections.map(c => `/col/${c.path}`), `/col/new`]
	const active = paths.find(path => !!matchPath(pathname, path))

	useEffect(() => {
		const unsub = store.subscribe('col', {
			onChange: data => {
				setCollections(
					Object.entries(data || {})
						.filter(([k]) => !['id', '_ref'].includes(k))
						.map(([_, v]) => v as (typeof collections)[number])
						.sort((a, b) => a.plural.localeCompare(b.plural))
				)
			}
		})
		return unsub
	}, [])

	return (
		<MenuSection label='Collections' icon={TbFolders} active={!!active}>
			{collections.length ? (
				collections.map(col => (
					<MenuLink
						key={col.path}
						to={`/col/${col.path}`}
						active={active === `/col/${col.path}`}
						label={col.plural}
					/>
				))
			) : (
				<MenuEmptyState />
			)}
			<MenuDivider />
			<MenuItem
				component={Link}
				to='/col/new'
				color={active === `/col/new` ? 'sky' : 'stone'}
				leftSection={<TbPlus />}>
				Add new
			</MenuItem>
		</MenuSection>
	)
}
