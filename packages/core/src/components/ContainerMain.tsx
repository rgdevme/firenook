import { PropsWithChildren } from 'react'

export const ContainerMain = ({ children }: PropsWithChildren) => {
	return (
		<div
			id='main'
			className='w-full h-full flex flex-row items-center justify-center'>
			<div className='w-full overflow-y-auto'>{children}</div>
		</div>
	)
}
