import { Button, ButtonGroup, Divider } from '@nextui-org/react'
import { useSetAtom } from 'jotai'
import { LuFilePlus2, LuListFilter, LuListTree } from 'react-icons/lu'
import { TbFolderX } from 'react-icons/tb'
import { useRecord } from '../../context/record'
import { collectionSchemaModalAtom } from '../Modals/collection.schema'
import { recordCreateAtom } from '../Modals/record.create'

export const CollectionControls = () => {
	const { original } = useRecord()

	const toggleSchemaMpdal = useSetAtom(collectionSchemaModalAtom)
	const toggleRecordCreateModal = useSetAtom(recordCreateAtom)

	return original.id ? null : (
		<>
			<ButtonGroup size='sm' variant='light' radius='full'>
				<Button isIconOnly color='default'>
					<LuListFilter size={18} />
				</Button>
				<Button
					isIconOnly
					onPress={() => toggleRecordCreateModal(true)}
					color='primary'>
					<LuFilePlus2 size={18} />
				</Button>
				{/* <Button isIconOnly onPress={deleteSelectedRecords} color='danger'>
							<LuFileX2 size={18} />
						</Button> */}
			</ButtonGroup>
			<Divider orientation='vertical' className='h-4' />
			<ButtonGroup size='sm' variant='light' radius='full'>
				<Button onPress={() => toggleSchemaMpdal(true)}>
					<LuListTree size={18} />
				</Button>
				<Button isIconOnly color='danger'>
					<TbFolderX size={18} />
				</Button>
			</ButtonGroup>
		</>
	)
}
