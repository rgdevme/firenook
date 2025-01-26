import { registerNumberPropertySchema } from '../components/property/number'
import { registerStringPropertySchema } from '../components/property/string'

export const registerProperties = () => {
	registerStringPropertySchema()
	registerNumberPropertySchema()
}
