import concurrently from 'concurrently'
import { readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

const getPackages = () => {
	const root = './packages'
	return readdirSync(root, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => {
			const fullPath = join(root, dirent.name, 'package.json')
			const buffer = readFileSync(fullPath)
			const json = buffer.toString()
			const pkg = JSON.parse(json)
			return {
				workspace: pkg.name,
				name: pkg.name.split('/').pop()
			}
		})
}

const __dirname = import.meta.dirname
const cwd = resolve(__dirname, '..')
const packages = getPackages()
const maxLength = Math.max(...packages.map(p => p.name.length))
const [script] = process.argv.slice(2)

console.log(cwd)

concurrently(
	[
		...packages.map(pkg => ({
			command: `npm -w ${pkg.workspace} run ${script}`,
			name: pkg.name.padEnd(maxLength, ' ')
		}))
	],
	{
		prefix: 'name',
		prefixColors: 'auto',
		killOthers: ['failure', 'success'],
		cwd: resolve(__dirname, '..')
	}
)
