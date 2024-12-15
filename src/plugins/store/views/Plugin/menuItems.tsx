import { useSetAtom } from 'jotai'
import { BiCollection } from 'react-icons/bi'
import { TbCirclePlus } from 'react-icons/tb'
import { IconBtn } from '../../../../components/IconButton'
import { MenuDivider } from '../../../../components/MenuDivider'
import { FirenookMenuItem } from '../../../core'
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
				<FirenookMenuItem
					key={curr.path}
					path={`c/${curr.path}`}
					label={curr.plural}
				/>
			))}
		</>
	)
}
