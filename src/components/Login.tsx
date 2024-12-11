import {
	Button,
	Card,
	CardBody,
	Image
	// Input,
	// Link,
	// Tab,
	// Tabs
} from '@nextui-org/react'
import { useToggle } from '@uidotdev/usehooks'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
export const Login = () => {
	const [loading, setLoading] = useToggle()
	// const [selected, setSelected] = useState('login')
	const auth = getAuth()
	// const { handleSubmit, register } = useForm({
	// 	disabled: loading,
	// 	defaultValues: {
	// 		email: '',
	// 		password: '',
	// 		name: '' as string | undefined
	// 	}
	// })

	const onSubmit = async data => {
		try {
			setLoading(true)
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result)
			const token = credential?.accessToken
			// The signed-in user info.
			const user = result.user
			// IdP data available using getAdditionalUserInfo(result)
			// ...
			console.log({ token, user })
		} catch (error) {
			console.error({ error })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex flex-col w-full h-full justify-center items-center'>
			<Card className='max-w-[340px]'>
				<CardBody className='overflow-hidden flex flex-col gap-4'>
					<Image src='https://placehold.co/600x400/EEE/31343C' />
					<Button
						startContent={<FcGoogle size={24} />}
						variant='light'
						color='primary'
						onClick={onSubmit}
						isLoading={loading}>
						Sign in with Google
					</Button>
					{/* <Tabs
						fullWidth
						size='md'
						aria-label='Tabs form'
						selectedKey={selected}
						onSelectionChange={k => setSelected(k as string)}>
						<Tab key='login' title='Login'>
							<form
								className='flex flex-col gap-4'
								onSubmit={handleSubmit(onSubmit)}>
								<Input
									isRequired
									label='Email'
									placeholder='Enter your email'
									type='email'
									{...register('email', { required: true })}
								/>
								<Input
									isRequired
									label='Password'
									placeholder='Enter your password'
									type='password'
									{...register('password', { required: true })}
								/>
								<p className='text-center text-small cursor-pointer'>
									Need to create an account?{' '}
									<Link size='sm' onPress={() => setSelected('sign-up')}>
										Sign up
									</Link>
								</p>
								<div className='flex gap-2 justify-end'>
									<Button fullWidth color='primary'>
										Login
									</Button>
								</div>
							</form>
						</Tab>
						<Tab key='sign-up' title='Sign up'>
							<form
								className='flex flex-col gap-4 h-[300px]'
								onSubmit={handleSubmit(onSubmit)}>
								<Input
									isRequired
									label='Name'
									placeholder='Enter your name'
									{...register('name', { required: true })}
								/>
								<Input
									isRequired
									label='Email'
									placeholder='Enter your email'
									type='email'
									{...register('email', { required: true })}
								/>
								<Input
									isRequired
									label='Password'
									placeholder='Enter your password'
									type='password'
									{...register('password', { required: true })}
								/>
								<p className='text-center text-small cursor-pointer'>
									Already have an account?{' '}
									<Link size='sm' onPress={() => setSelected('login')}>
										Login
									</Link>
								</p>
								<div className='flex gap-2 justify-end'>
									<Button type='submit' fullWidth color='primary'>
										Sign up
									</Button>
								</div>
							</form>
						</Tab>
					</Tabs> */}
				</CardBody>
			</Card>
		</div>
	)
}
