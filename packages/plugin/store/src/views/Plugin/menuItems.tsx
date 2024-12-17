import { IconBtn } from '@firenook/core/src/components/IconButton'
import { MenuDivider } from '@firenook/core/src/components/MenuDivider'
import { MenuItem } from '@firenook/core/src/components/MenuItem'
import { useSetAtom } from 'jotai'
import { BiCollection } from 'react-icons/bi'
import { TbCirclePlus } from 'react-icons/tb'
import { useCollections } from '../../context/collections'
import { collectionModalAtom } from '../Modals/collection.create'

export const MenuItems = () => {
	const { collections } = useCollections()
	const set = useSetAtom(collectionModalAtom)
	return (
		<>
			<MenuDivider
				title='Collections'
				compact={false}
				icon={<BiCollection />}
				action={<IconBtn icon={TbCirclePlus} onClick={() => set(true)} />}
			/>
			{collections.map(curr => (
				<MenuItem key={curr.path} path={`c/${curr.path}`} label={curr.plural} />
			))}
		</>
	)
}
