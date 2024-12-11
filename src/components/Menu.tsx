import {
	Button,
	ButtonProps,
	Divider,
	extendVariants,
	Image,
	useDisclosure
} from '@nextui-org/react'
import { useState } from 'react'
import { IconType } from 'react-icons'
import { BiCollection } from 'react-icons/bi'
import { PiCaretCircleDoubleLeft } from 'react-icons/pi'
import { TbCirclePlus, TbFiles, TbSettings2 } from 'react-icons/tb'
import { Link } from 'react-router'
import { useCollectionsList } from '../context/collectionsList'
import { useBucketsList } from '../context/bucket'
import { BucketModal } from './Bucket/create'
import { CollectionModal } from './Collection/create'
import { MdLogout } from 'react-icons/md'
import { getAuth, signOut } from 'firebase/auth'

export const Menu = () => {
	const [toggle, setToggle] = useState(false)
	const { collections } = useCollectionsList()
	const { buckets } = useBucketsList()
	const collectionModal = useDisclosure()
	const bucketModal = useDisclosure()

	return (
		<section
			id='menu'
			data-active={toggle}
			className='flex flex-col gap-2 p-2 relative z-10 overflow-visible w-48 data-[active=true]:w-[72px] transition-all'>
			<Button
				isIconOnly
				size='sm'
				radius='full'
				variant='solid'
				color='default'
				data-active={toggle}
				onClick={() => setToggle(p => !p)}
				className='p-1 absolute z-50 top-12 right-0 text-zinc-400 -translate-x-3 transition-all hover:text-zinc-600 data-[active=true]:-rotate-180 data-[active=true]:-translate-x-5'>
				<PiCaretCircleDoubleLeft
					size={20}
					color='currentcolor'
					fill='currentcolor'
				/>
			</Button>
			<Link to='/dashboard'>
				<div className='flex flex-row gap-2 mb-4'>
					<Image
						width={56}
						height={56}
						className='object-cover min-w-14'
						alt='NextUI hero Image'
						src='https://nextui.org/images/hero-card-complete.jpeg'
					/>
					<span
						data-active={toggle}
						className='w-full data-[active=true]:w-0 data-[active=true]:overflow-hidden transition-all h-full max-w-16'>
						Company name
					</span>
				</div>
			</Link>
			<Div
				title='Collections'
				compact={toggle}
				icon={<BiCollection />}
				action={
					<IconBtn icon={TbCirclePlus} onClick={collectionModal.onOpen} />
				}
			/>
			{collections.map(c => (
				<Button
					size='sm'
					key={c.path}
					as={Link}
					to={`/${c.path}`}
					variant='light'
					color='primary'
					className='justify-start'>
					{c.plural}
				</Button>
			))}
			<Div
				title='Buckets'
				compact={toggle}
				icon={<TbFiles />}
				action={<IconBtn icon={TbCirclePlus} onClick={bucketModal.onOpen} />}
			/>
			{buckets.map(c => (
				<Button
					size='sm'
					key={c.path}
					as={Link}
					to={`bucket/${c.path}`}
					variant='light'
					color='primary'
					className='justify-start'>
					{c.name}
				</Button>
			))}

			<Div title='Settings' icon={<TbSettings2 />} />
			<Button size='sm'>Small</Button>
			<Button size='sm'>Small</Button>
			<Button size='sm'>Small</Button>
			<div className='flex-1 flex flex-col justify-end mb-1'>
				<Button
					size='sm'
					variant='light'
					color='danger'
					startContent={<MdLogout />}
					onClick={() => signOut(getAuth())}>
					Logout
				</Button>
			</div>
			<CollectionModal {...collectionModal} />
			<BucketModal {...bucketModal} />
		</section>
	)
}

const Div = ({
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

const IconBtn = ({ icon: Icon, ...props }: { icon?: IconType } & ButtonProps) =>
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
