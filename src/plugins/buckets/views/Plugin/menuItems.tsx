import { useSetAtom } from 'jotai'
import { TbCirclePlus, TbFiles } from 'react-icons/tb'
import { IconBtn } from '../../../../components/IconButton'
import { MenuDivider } from '../../../../components/MenuDivider'
import { FirenookMenuItem } from '../../../core'
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
				<FirenookMenuItem
					key={curr.path}
					path={`c/${curr.path}`}
					label={curr.name}
				/>
			))}
		</>
	)
}
