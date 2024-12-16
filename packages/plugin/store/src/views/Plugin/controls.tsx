import { Path } from '@firenook/core/src/routes'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react'
import { PluginRoutes } from '../..'
import { useCollections } from '../../context/collections'
import { useRecord } from '../../context/record'
import { CollectionControls } from '../Collection/controls'
import { RecordControls } from '../Record/controls'

export const PluginControls = () => {
	const { current } = useCollections()
	const { original } = useRecord()

	return !current ? null : (
		<>
			<div className='flex flex-1'>
				<Breadcrumbs size='sm' variant='solid'>
					<BreadcrumbItem href={Path.DASHBOARD}>Dashboard</BreadcrumbItem>
					<BreadcrumbItem href={PluginRoutes.collection.build(current.path)}>
						{current.singular}
					</BreadcrumbItem>
					{original.id && (
						<BreadcrumbItem
							href={PluginRoutes.record.build(current.path, original.id)}>
							{original.id}
						</BreadcrumbItem>
					)}
				</Breadcrumbs>
			</div>
			<CollectionControls />
			<RecordControls />
		</>
	)
}
