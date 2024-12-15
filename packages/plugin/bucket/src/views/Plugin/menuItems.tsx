import { useSetAtom } from 'jotai'
import { TbCirclePlus, TbFiles } from 'react-icons/tb'
import { IconBtn } from '../../../../../core/src/components/IconButton'
import { MenuDivider } from '../../../../../core/src/components/MenuDivider'
import { MenuItem } from '../../../../../core/src/components/MenuItem'
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
