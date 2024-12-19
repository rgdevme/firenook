import { Button } from '@nextui-org/react'
import { Link } from 'react-router'

export const FNMenuItem = ({
	path,
	label
}: {
	path: string
	label: string
}) => {
	return (
		<Button
			size='sm'
			as={Link}
			to={path}
			variant='light'
			color='primary'
			className='justify-start'>
			{label}
		</Button>
	)
}
