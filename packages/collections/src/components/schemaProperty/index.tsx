import { useField, useFields } from '@firenook/core'
import {
	ActionIcon,
	Flex,
	Paper,
	Select,
	Switch,
	TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDebouncedCallback, useElementSize, useToggle } from '@mantine/hooks'
import { useCallback } from 'react'
import { TbChevronDown, TbGripHorizontal, TbTrash } from 'react-icons/tb'
import { CollectionSchemaProperty } from '../../types/collection'
import { getPath } from '../../utils'

export const ProvisionalPropertyComponent = ({
	onChange,
	onTrash,
	item
}: {
	item: CollectionSchemaProperty
	onChange: (data: CollectionSchemaProperty) => void
	onTrash: () => void
}) => {
	const [open, toggle] = useToggle()
	const { ref, height } = useElementSize()
	const debouncedOnChange = useDebouncedCallback(onChange, 350)
	const [fields] = useFields()

	const fieldTypes = [...fields.values()].map(f => ({
		label: f.name,
		value: f.type
	}))

	const updateDefaultValues = useCallback(() => {
		console.log('type changed', item)
		form.setFieldValue('defaultValue', item.defaultValue)
		form.setFieldValue('value', item.defaultValue)
	}, [item])

	const form = useForm<CollectionSchemaProperty>({
		initialValues: item,
		onValuesChange: (current, previous) => {
			if (current.type !== previous.type) {
				updateDefaultValues()
			}
			if (current.keyname === getPath(previous.label)) {
				form.setFieldValue('keyname', getPath(current.label))
			}
			debouncedOnChange(current)
		}
	})

	const schemaProp = useField(form.getValues().type)

	return !schemaProp?.input ? null : (
		<Paper p='xs' withBorder>
			<Flex gap='xs' direction='column'>
				<Flex direction='row' wrap='nowrap' gap='xs' align='center'>
					<ActionIcon variant='subtle'>
						<TbGripHorizontal />
					</ActionIcon>
					<Flex gap='xs' w='100%' direction='row'>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='Property name'
							{...form.getInputProps('label', { type: 'input' })}
						/>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='property_key'
							{...form.getInputProps('keyname', { type: 'input' })}
						/>
					</Flex>
					<ActionIcon variant='subtle' onClick={onTrash}>
						<TbTrash />
					</ActionIcon>
					<ActionIcon variant='subtle' onClick={() => toggle()}>
						<TbChevronDown
							data-open={open}
							style={{
								transform: open ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
								transition: 'all 150ms ease-in-out'
							}}
						/>
					</ActionIcon>
				</Flex>

				<Flex
					ref={ref}
					justify='space-between'
					align='center'
					wrap='wrap'
					direction='row'
					px={40}
					gap='xs'
					style={{
						maxHeight: '5rem',
						height: open ? height || 'auto' : 0,
						opacity: open ? 1 : 0,
						marginTop: !open ? '-8px' : 0,
						transition: 'all'
					}}>
					<Select
						size='xs'
						variant='filled'
						flex='1 1 45%'
						placeholder='Select a type'
						data={fieldTypes}
						{...form.getInputProps('type', { type: 'input' })}
					/>
					<schemaProp.input
						isDirty={false}
						isSubmitting={false}
						{...form.getValues()}
						{...form.getInputProps('defaultValue', { type: 'input' })}
						label={undefined}
						placeholder='Default value'
						key={item.keyname}
					/>
					<Switch
						size='xs'
						label='Nullable'
						{...form.getInputProps('isNullable', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Sort'
						{...form.getInputProps('isSort', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Filter'
						{...form.getInputProps('isFilter', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Show'
						{...form.getInputProps('isShown', { type: 'checkbox' })}
					/>
					<Switch
						size='xs'
						label='Array'
						{...form.getInputProps('isArray', { type: 'checkbox' })}
					/>
				</Flex>
			</Flex>
		</Paper>
	)
}
