import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	ButtonGroup,
	Divider,
	Tooltip,
	useDisclosure
} from '@nextui-org/react'
import {
	LuCopyPlus,
	LuFilePlus2,
	LuFileX2,
	LuListFilter,
	LuListTree,
	LuSave,
	LuTrash2
} from 'react-icons/lu'
import { useParams } from 'react-router'
import { useCollection } from '../context/collection'
import { CollectionSchema } from './Collection/schema'
import { CreateRecord } from './Record/create'
import { TbFolderX } from 'react-icons/tb'
import { useCollectionsList } from '../context/collectionsList'
import { useRecord } from '../context/record'

export const Header = () => {
	const { collection, record } = useParams()
	const { current } = useCollectionsList()
	const { store, selection } = useCollection()
	const rec = useRecord()
	const collectionSchema = useDisclosure()
	const recordCreation = useDisclosure()

	const deleteSelectedRecords = async () => {
		if (!store) return
		console.log('destroying')
		const promises = [...selection.values().map(s => store.destroy(s))]
		await Promise.all(promises)
		console.log('destroyed')
	}

	return (
		<header
			id='header'
			className='w-full flex flex-row no-wrap gap-2 items-center justify-end p-2 pr-4'>
			<div className='flex flex-1'>
				<Breadcrumbs size='sm' variant='solid'>
					<BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
					{collection && (
						<BreadcrumbItem href={`/${collection}`}>
							{current?.singular}
						</BreadcrumbItem>
					)}
					{record && (
						<BreadcrumbItem href={`/${collection}/${record}`}>
							{record}
						</BreadcrumbItem>
					)}
				</Breadcrumbs>
			</div>
			{!!collection && !record ? (
				<>
					<ButtonGroup size='sm' variant='light' radius='full'>
						<Button isIconOnly color='default'>
							<LuListFilter size={18} />
						</Button>
						<Button isIconOnly onPress={recordCreation.onOpen} color='primary'>
							<LuFilePlus2 size={18} />
						</Button>
						<Button isIconOnly onPress={deleteSelectedRecords} color='danger'>
							<LuFileX2 size={18} />
						</Button>
					</ButtonGroup>
					<Divider orientation='vertical' className='h-4' />
					<ButtonGroup size='sm' variant='light' radius='full'>
						<Button onPress={collectionSchema.onOpen}>
							<LuListTree size={18} />
						</Button>
						<Button isIconOnly color='danger'>
							<TbFolderX size={18} />
						</Button>
					</ButtonGroup>
				</>
			) : !!collection && !!record ? (
				<div className='flex gap-4'>
					<Tooltip content='Save'>
						<Button
							isIconOnly
							size='sm'
							variant='light'
							radius='full'
							color='success'
							onPress={() => rec.save?.(rec.data)}>
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
							onPress={() => rec.copy?.(rec.data)}>
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
							onPress={rec?.remove}>
							<LuTrash2 size={18} />
						</Button>
					</Tooltip>
				</div>
			) : null}
			<CollectionSchema {...collectionSchema} />
			<CreateRecord {...recordCreation} />
		</header>
	)
}
