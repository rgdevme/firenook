import {
	MenuDivider,
	MenuItem,
	MenuLink,
	MenuSection,
	useAppState
} from '@firenook/core'
import { FC, useEffect } from 'react'
import { TbLibraryPhoto, TbPlus } from 'react-icons/tb'
import { Link, matchPath, useLocation } from 'react-router'
import { useBuckets, useBucketsStore } from '../context/buckets'
import { BucketData } from '../context/types'

export const BucketsMenu: FC = () => {
	const { pathname } = useLocation()
	const [buckets, setBuckets] = useAppState('buckets')
	const store = useBucketsStore()
	const { getAsParam } = useBuckets()

	const paths = [...buckets.map(b => `/buc/${getAsParam(b)}`), `/buc/new`]
	const active = paths.find(path => !!matchPath(pathname, path))

	useEffect(() => {
		const unsub = store.subscribe('buckets', {
			onChange: data => {
				setBuckets(
					Object.entries(data ?? {})
						.filter(([k]) => !['id', '_ref'].includes(k))
						.map(([_, v]) => v as BucketData)
						.sort((a, b) => getAsParam(a)!.localeCompare(getAsParam(b)!)) ?? []
				)
			}
		})
		return unsub
	}, [])

	return (
		<MenuSection label='Collections' icon={TbLibraryPhoto} active={!!active}>
			{buckets.map(buc => {
				const key = getAsParam(buc)
				return (
					<MenuLink
						key={key}
						to={`/buc/${key}`}
						active={active === `/buc/${key}`}
						label={buc.name}
					/>
				)
			})}
			<MenuDivider />
			<MenuItem
				component={Link}
				to='/buc/new'
				color={active === `/buc/new` ? 'sky' : 'stone'}
				leftSection={<TbPlus />}>
				Add new
			</MenuItem>
		</MenuSection>
	)
}
