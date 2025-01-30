import { Container, Flex, Text, Title } from '@mantine/core'
import { useCounter, useInterval } from '@mantine/hooks'
import { useEffect } from 'react'
import { TbError404 } from 'react-icons/tb'
import { useNavigate } from 'react-router'

export const NotFound = () => {
	const nav = useNavigate()
	const [countdown, { decrement }] = useCounter(5)
	const interval = useInterval(() => {
		if (countdown <= 1) nav('/')
		else decrement()
	}, 1000)

	useEffect(() => {
		interval.start()
		return interval.stop
	}, [])

	return (
		<Container>
			<Flex
				h='100vh'
				justify='center'
				align='center'
				direction='column'
				gap='md'>
				<TbError404 size={200} />
				<Title order={2}>Nothing here!</Title>
				<Text c='stone.3' fw='bold' size='xs' ff='monospace'>
					Back to home in {countdown}s
				</Text>
			</Flex>
		</Container>
	)
}
