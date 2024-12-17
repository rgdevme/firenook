import { IconBtn, MenuDivider, MenuItem } from '@firenook/core'
import { BiCollection } from 'react-icons/bi'
import { TbCirclePlus } from 'react-icons/tb'
import { useCollections } from '../../context/collections'
import { useCollectionModalToggle } from '../Modals/collection.create'

export const MenuItems = () => {
	const { collections } = useCollections()
	const set = useCollectionModalToggle()
	return (
		<>
			<MenuDivider
				title='Collections'
				compact={false}
				icon={<BiCollection />}
				action={<IconBtn icon={TbCirclePlus} onPress={() => set(true)} />}
			/>
			{collections.map(curr => (
				<MenuItem key={curr.path} path={`c/${curr.path}`} label={curr.plural} />
			))}
		</>
	)
}
