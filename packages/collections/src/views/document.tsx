import { FirebormStore } from 'fireborm'
import { FC } from 'react'
import { useParams } from 'react-router'

export const Document: FC<{ store: FirebormStore<{}> }> = () => {
	const params = useParams()
	console.log(params)

	return <div>Document</div>
}
