import { ActionIcon, Button, Flex, Menu, Table, TextInput } from '@mantine/core'
import { FirebormStore } from 'fireborm'
import { FC, useEffect } from 'react'
import { TbDotsVertical, TbFilter, TbPlus, TbSearch } from 'react-icons/tb'

export const Collection: FC<{ store: FirebormStore<{}> }> = () => {
	// const fireborm = getAppState<Fireborm>('fireborm').get()
	// const store = fireborm.createStore({})

	useEffect(() => {
		console.log()
	}, [])

	return (
		<div>
			<Flex gap='md'>
				<TextInput
					name='search'
					placeholder='Search'
					leftSection={<TbSearch />}
					flex='1 1 auto'
				/>
				<Menu position='bottom-end'>
					<Menu.Target>
						<ActionIcon size='input-sm' variant='subtle'>
							<TbFilter />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Collection options</Menu.Label>
						<Menu.Item>Edit</Menu.Item>
						<Menu.Item>Delete Collection</Menu.Item>
						<Menu.Item>Standardize</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Button variant='light' leftSection={<TbPlus />}>
					New
				</Button>
				<Menu position='bottom-end'>
					<Menu.Target>
						<ActionIcon size='input-sm' variant='subtle'>
							<TbDotsVertical />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Collection options</Menu.Label>
						<Menu.Item>Edit</Menu.Item>
						<Menu.Item>Delete Collection</Menu.Item>
						<Menu.Item>Standardize</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Flex>
			<Table
				highlightOnHover
				withColumnBorders
				stickyHeader
				stickyHeaderOffset={60}
				verticalSpacing='xs'
				data={{ head: ['Head'], body: [['Jimmy']] }}
			/>
		</div>
	)
}
