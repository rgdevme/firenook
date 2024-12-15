import { Button, Image, useDisclosure } from '@nextui-org/react'
import { getAuth, signOut } from 'firebase/auth'
import { useState } from 'react'
import { MdLogout } from 'react-icons/md'
import { PiCaretCircleDoubleLeft } from 'react-icons/pi'
import { TbCirclePlus, TbFiles, TbSettings2 } from 'react-icons/tb'
import { Link } from 'react-router'
import { useBucketsList } from '../context/bucket'
import { useAppConfig } from '../context'
import { Path } from '../routes'
import { BucketModal } from './Bucket/create'
import { IconBtn } from './IconButton'
import { MenuDivider } from './MenuDivider'
// import { CollectionModal } from './Collection/create'

export const Menu = () => {
	const { logo, menuItems } = useAppConfig()
	const [toggle, setToggle] = useState(false)
	const { buckets } = useBucketsList()
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
			<Link to={Path.DASHBOARD}>
				<div className='flex flex-row gap-2 mb-4 items-center'>
					<Image
						width={56}
						height={56}
						className='object-contain min-w-14'
						alt='NextUI hero Image'
						src={logo ?? 'https://nextui.org/images/hero-card-complete.jpeg'}
					/>
					<span
						data-active={toggle}
						className='w-full data-[active=true]:w-0 data-[active=true]:overflow-hidden transition-all h-full max-w-16 font-bold'>
						Firenook
					</span>
				</div>
			</Link>
			{menuItems.map((X, i) => (
				<X key={i} />
			))}

			<MenuDivider
				title='Buckets'
				compact={toggle}
				icon={<TbFiles />}
				action={<IconBtn icon={TbCirclePlus} onClick={bucketModal.onOpen} />}
			/>
			{buckets.map(b => (
				<Button
					size='sm'
					key={b.path}
					as={Link}
					to={Path.BUCKET.replace(':bid', b.path)}
					variant='light'
					color='primary'
					className='justify-start'>
					{b.name}
				</Button>
			))}

			<MenuDivider title='Settings' icon={<TbSettings2 />} />
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
			<BucketModal {...bucketModal} />
		</section>
	)
}
