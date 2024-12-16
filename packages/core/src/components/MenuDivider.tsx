import { Divider } from '@nextui-org/react'

export const MenuDivider = ({
	title,
	icon,
	action,
	compact = false
}: {
	title: string
	icon?: JSX.Element
	action?: JSX.Element
	compact?: boolean
}) => {
	return (
		<div className='cursor-default select-none flex flex-row h-6 gap-2 px-2 justify-center items-center text-zinc-400 hover:text-primary transition duration-75'>
			{icon}
			{!compact && (
				<>
					<span
						data-compact={compact}
						className='text-xs data-[compact=true]:hidden'>
						{title}
					</span>
					<Divider className='flex-1 bg-zinc-200' />
					{action}
				</>
			)}
		</div>
	)
}
