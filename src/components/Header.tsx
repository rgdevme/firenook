import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	ButtonGroup,
	Divider,
	useDisclosure
} from '@nextui-org/react'
import { LuFilePlus2, LuFileX2, LuListFilter, LuListTree } from 'react-icons/lu'
import { TbFolderX } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { useCollection } from '../context/collection'
import { useCollectionsList } from '../context/collectionsList'
import { CollectionSchema } from './Collection/schema'
import { RecordControls } from './Record/controls'
import { CreateRecord } from './Record/create'

export const Header = () => {
	const { collection, record } = useParams()
	const nav = useNavigate()
	const { current } = useCollectionsList()
	const { store, selection } = useCollection()
	const collectionSchema = useDisclosure()
	const recordCreation = useDisclosure()

	const deleteSelectedRecords = async () => {
		if (!store || !collection || !selection.size) return
		const promises = [...selection.values().map(s => store.destroy(s))]
		await Promise.all(promises)
		nav(`/${collection}`)
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
			{!!collection && !record && (
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
			)}
			<RecordControls />
			<CollectionSchema {...collectionSchema} />
			<CreateRecord {...recordCreation} />
		</header>
	)
}
