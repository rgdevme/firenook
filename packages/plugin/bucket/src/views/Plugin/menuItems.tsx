import { IconBtn } from '@firenook/core/src/components/IconButton'
import { MenuDivider } from '@firenook/core/src/components/MenuDivider'
import { MenuItem } from '@firenook/core/src/components/MenuItem'
import { useSetAtom } from 'jotai'
import { TbCirclePlus, TbFiles } from 'react-icons/tb'
import { useBucketsList } from '../../context/bucket'
import { bucketsModalAtom } from '../Bucket/create'

export const MenuItems = () => {
	const { buckets } = useBucketsList()
	const set = useSetAtom(bucketsModalAtom)
	return (
		<>
			<MenuDivider
				title='Buckets'
				compact={false}
				icon={<TbFiles />}
				action={<IconBtn icon={TbCirclePlus} onClick={() => set(true)} />}
			/>
			{buckets.map(curr => (
				<MenuItem key={curr.path} path={`c/${curr.path}`} label={curr.name} />
			))}
		</>
	)
}
