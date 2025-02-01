import { useField, useFields } from '@firenook/core'
import {
	ActionIcon,
	Checkbox,
	CheckboxProps,
	Divider,
	Flex,
	Paper,
	Select,
	Text,
	TextInput,
	Tooltip,
	TooltipFloatingProps
} from '@mantine/core'
import { useForm } from '@mantine/form'
// import { useEffect } from 'react'
import {
	TbArrowsUpDown,
	TbBracketsContain,
	TbEyeCheck,
	TbFilterCheck,
	TbGripHorizontal,
	TbQuestionMark,
	TbTrash
} from 'react-icons/tb'
import { CollectionSchemaProperty } from '../../types/collection'
import { getFiledTypes, getPath } from '../../utils'

export const Property = ({
	onChange,
	onTrash,
	item
}: {
	item: CollectionSchemaProperty
	onChange: (data: CollectionSchemaProperty) => void
	onTrash: () => void
}) => {
	// const [open, toggle] = useToggle()
	const [fields] = useFields()
	const schemaProp = useField(item.type)

	const form = useForm<CollectionSchemaProperty>({
		initialValues: item,
		enhanceGetInputProps: () => ({ defaultValue: undefined }),
		onValuesChange: current => onChange(current)
	})

	return !schemaProp?.input ? null : (
		<Paper p='xs' withBorder>
			<Flex gap='xs' direction='column'>
				<Flex direction='row' wrap='nowrap' gap='xs' align='center'>
					<ActionIcon variant='subtle'>
						<TbGripHorizontal />
					</ActionIcon>

					<Flex gap='xs' w='100%' direction='row' align='center'>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='Property name'
							{...form.getInputProps('label', { type: 'input' })}
							onChange={val => {
								const prevLabel = form.values.label
								const prevKey = form.values.keyname
								const synced = prevKey === getPath(prevLabel)
								const newLabel = val.target.value

								form.setValues({
									label: newLabel,
									keyname: synced ? getPath(newLabel) : prevKey
								})
							}}
						/>
						<TextInput
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='property_key'
							{...form.getInputProps('keyname', { type: 'input' })}
						/>
						<Select
							size='xs'
							variant='filled'
							flex='1 1 auto'
							placeholder='Select a type'
							data={getFiledTypes(fields)}
							{...form.getInputProps('type', { type: 'input' })}
							onChange={val => {
								if (!val) return
								const f = fields.get(val as any)
								if (!f) return
								form.setValues({
									type: f.type,
									defaultValue: f.defaultValue
								})
							}}
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
					</Flex>
					{/* <ActionIcon variant='subtle' onClick={() => toggle()}>
						<TbChevronDown
							data-open={open}
							style={{
								transform: open ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
								transition: 'all 150ms ease-in-out'
							}}
						/>
            </ActionIcon> */}

					<Tooltip {...tooltipProps('Is it an array?')}>
						<Checkbox
							icon={TbBracketsContain}
							{...checkboxProps(form.values.isArray)}
							{...form.getInputProps('isArray', { type: 'checkbox' })}
						/>
					</Tooltip>

					<Divider orientation='vertical' />

					<Tooltip {...tooltipProps('Is it nullable?')}>
						<Checkbox
							icon={TbQuestionMark}
							{...checkboxProps(form.values.isNullable)}
							{...form.getInputProps('isNullable', { type: 'checkbox' })}
						/>
					</Tooltip>
					<Tooltip
						{...tooltipProps(
							'Can be used for sorting in the collection table'
						)}>
						<Checkbox
							icon={TbArrowsUpDown}
							disabled={!form.values.isShown}
							{...checkboxProps(form.values.isSort)}
							{...form.getInputProps('isSort', { type: 'checkbox' })}
						/>
					</Tooltip>
					<Tooltip
						{...tooltipProps(
							'Can be used for filtering in the collection table'
						)}>
						<Checkbox
							icon={TbFilterCheck}
							disabled={!form.values.isShown}
							{...checkboxProps(form.values.isFilter)}
							{...form.getInputProps('isFilter', { type: 'checkbox' })}
						/>
					</Tooltip>
					<Tooltip {...tooltipProps('Display column in the collection table')}>
						<Checkbox
							icon={TbEyeCheck}
							{...checkboxProps(form.values.isShown)}
							{...form.getInputProps('isShown', { type: 'checkbox' })}
							onChange={val => {
								const checked = val.target.checked
								if (checked) form.setFieldValue('isShown', checked)
								else
									form.setValues({
										isShown: checked,
										isFilter: false,
										isSort: false
									})
							}}
						/>
					</Tooltip>

					<Divider orientation='vertical' />

					<ActionIcon variant='subtle' onClick={onTrash} color='rose' size='lg'>
						<TbTrash />
					</ActionIcon>
				</Flex>
			</Flex>
		</Paper>
	)
}

const tooltipProps = (
	label: string
): Omit<TooltipFloatingProps, 'children'> => ({
	label: (
		<Text size='xs' c='stone.5'>
			{label}
		</Text>
	),
	offset: 8,
	position: 'bottom',
	bg: 'stone.1'
})

const checkboxProps = (value: boolean | undefined): Partial<CheckboxProps> => ({
	size: 'lg',
	iconColor: value ? undefined : 'stone.3',
	styles: {
		input: { border: 'none', cursor: 'pointer' },
		icon: { opacity: 1, transform: 'none' }
	}
})
