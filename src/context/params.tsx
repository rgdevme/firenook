import { createContext, PropsWithChildren, useContext, useState } from 'react'

const ParamsCtx = createContext({
	params: {} as {
		bid?: string
		cid?: string
		rid?: string
		sid?: string
	},
	exposeParams: (({}) => {}) as (params: {
		bid?: string
		cid?: string
		rid?: string
		sid?: string
	}) => void
})

export const ParamsProvider = ({ children }: PropsWithChildren) => {
	const [params, exposeParams] = useState({})

	return (
		<ParamsCtx.Provider value={{ params, exposeParams }} children={children} />
	)
}

export const useParamsContext = () => useContext(ParamsCtx)
