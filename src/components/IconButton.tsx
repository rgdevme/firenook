import { Button, ButtonProps, extendVariants } from '@nextui-org/react'
import { IconType } from 'react-icons'

export const IconBtn = ({
	icon: Icon,
	...props
}: { icon?: IconType } & ButtonProps) =>
	Icon && (
		<CustomBtn {...props} size='xs' isIconOnly color='current' variant='light'>
			<Icon size={16} />
		</CustomBtn>
	)

const CustomBtn = extendVariants(Button, {
	variants: {
		color: {
			current: 'text-[currentcolor] bg-white'
		},
		size: {
			xs: 'p-1 min-w-min h-6 text-tiny gap-1 rounded-small'
		}
	}
})
