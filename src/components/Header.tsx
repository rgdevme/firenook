import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	ButtonGroup,
	Divider,
	useDisclosure
} from '@nextui-org/react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { useCollection } from '../context/collection'
import { CollectionSchema } from './Collection/schema'

export const Header = () => {
	const { collection, record } = useParams()
	const { store } = useCollection()

	const [loading, setLoading] = useState(false)
	const collectionSchema = useDisclosure()

	const handlerecordCreation = async () => {
		if (!store) return
		setLoading(true)
		await store.create({})
		setLoading(false)
	}
	return (
		<header
			id='header'
			className='w-full flex flex-row no-wrap gap-2 items-center justify-end p-2 pr-4'>
			<div className='flex flex-1'>
				<Breadcrumbs size='sm' variant='solid'>
					<BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
					{collection && (
						<BreadcrumbItem href={`/${collection}`}>Collection</BreadcrumbItem>
					)}
					{record && (
						<BreadcrumbItem href={`/${collection}/${record}`}>
							{record}
						</BreadcrumbItem>
					)}
				</Breadcrumbs>
			</div>
			<ButtonGroup size='sm' variant='light' radius='full' color='primary'>
				<Button>Filter</Button>
				<Button onClick={handlerecordCreation} isLoading={loading}>
					Create
				</Button>
				<Button>Delete selection</Button>
			</ButtonGroup>
			<Divider orientation='vertical' className='h-4' />
			<ButtonGroup size='sm' variant='light' radius='full' color='primary'>
				<Button onClick={collectionSchema.onOpen}>Schema</Button>
				<Button>Delete collection</Button>
			</ButtonGroup>
			<CollectionSchema {...collectionSchema} />
		</header>
	)
}
