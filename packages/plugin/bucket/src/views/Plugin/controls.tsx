import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react'
import { PluginRoutes } from '../..'
import { Path } from '../../../../../core/src/routes'
import { useCollections } from '../../../../store/src/context/collections'
import { useRecord } from '../../../../store/src/context/record'
import { CollectionControls } from '../../../../store/src/views/Collection/controls'
import { RecordControls } from '../../../../store/src/views/Record/controls'

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
