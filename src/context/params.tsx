import { createContext, PropsWithChildren, useContext, useState } from 'react'

const ParamsCtx = createContext({
	params: {} as {
		collection?: string
		record?: string
		subParams?: string
	},
	exposeParams: (({}) => {}) as (params: {
		collection?: string
		record?: string
		subParams?: string
	}) => void
})

export const ParamsProvider = ({ children }: PropsWithChildren) => {
	const [params, exposeParams] = useState({})

	return (
		<ParamsCtx.Provider value={{ params, exposeParams }} children={children} />
	)
}

export const useParamsContext = () => useContext(ParamsCtx)
