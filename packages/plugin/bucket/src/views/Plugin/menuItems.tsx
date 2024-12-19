import { IconBtn, MenuDivider, MenuItem } from '@firenook/core'
import { TbCirclePlus, TbFiles } from 'react-icons/tb'
import { useBucketsList } from '../../context/bucket'
import { useBucketModalToggle } from '../Bucket/create'

export const MenuItems = () => {
	const { buckets } = useBucketsList()
	const set = useBucketModalToggle()
	return (
		<>
			<MenuDivider
				title='Buckets'
				compact={false}
				icon={<TbFiles />}
				action={<IconBtn icon={TbCirclePlus} onPress={() => set(true)} />}
			/>
			{buckets.map(curr => (
				<MenuItem key={curr.path} path={`b/${curr.path}`} label={curr.name} />
			))}
		</>
	)
}
