import { Chip, Pagination } from '@nextui-org/react'
// import { useCollection } from '../context/collection'

export const Footer = () => {
	// const { selection, count } = useCollection()

	return (
		<footer
			id='footer'
			className='px-2 py-4 flex gap-4 items-center justify-end'>
			<Pagination isCompact showControls total={10} initialPage={1} />
			<div className='flex-1'></div>

			<Chip size='sm'>selected: {0} / size: 0kb</Chip>
			<Chip size='sm'>records: {0} / size: 0kb</Chip>
		</footer>
	)
}
