import { Button, Tooltip } from '@nextui-org/react'
import { LuCopyPlus, LuSave, LuTrash2 } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router'
import { useRecord } from '../../context/record'
import { Path } from '../../routes'

export const RecordControls = () => {
	const { cid, rid } = useParams()
	const { save, copy, remove } = useRecord()
	const nav = useNavigate()

	return !rid ? null : (
		<div className='flex gap-4'>
			<Tooltip content='Save'>
				<Button
					isIconOnly
					size='sm'
					variant='light'
					radius='full'
					color='success'
					onPress={save}>
					<LuSave size={18} />
				</Button>
			</Tooltip>
			<Tooltip content='Duplicate'>
				<Button
					isIconOnly
					size='sm'
					variant='light'
					radius='full'
					color='primary'
					onPress={copy}>
					<LuCopyPlus size={18} />
				</Button>
			</Tooltip>
			<Tooltip content='Delete'>
				<Button
					isIconOnly
					size='sm'
					variant='light'
					radius='full'
					color='danger'
					onPress={() => {
						remove?.()
						nav(Path.COLLECTION.replace(':cid', cid!))
					}}>
					<LuTrash2 size={18} />
				</Button>
			</Tooltip>
		</div>
	)
}
