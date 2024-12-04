import {
	AdmonitionDirectiveDescriptor,
	codeBlockPlugin,
	codeMirrorPlugin,
	diffSourcePlugin,
	directivesPlugin,
	frontmatterPlugin,
	headingsPlugin,
	imagePlugin,
	KitchenSinkToolbar,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	quotePlugin,
	sandpackPlugin,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

export const MarkdownProperty = ({
	label,
	value,
	onChange
}: {
	label: string
	value?: string
	onChange: (val: string) => void
}) => {
	return !value ? null : (
		<MDXEditor
			className='bg-default-100 rounded-lg'
			markdown={value}
			placeholder={label}
			onChange={onChange}
			plugins={[
				toolbarPlugin({
					toolbarClassName: 'mdxeditor-toolbar',
					toolbarContents: () => <KitchenSinkToolbar />
				}),
				listsPlugin(),
				quotePlugin(),
				headingsPlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				imagePlugin({
					imageUploadHandler: async () =>
						Promise.resolve('https://picsum.photos/200/300')
				}),
				tablePlugin(),
				thematicBreakPlugin(),
				frontmatterPlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
				// sandpackPlugin(
				// 	{ sandpackConfig: virtuosoSampleSandpackConfig }
				// ),
				codeMirrorPlugin({
					codeBlockLanguages: {
						tsx: 'TypeScript',
						js: 'JavaScript',
						jsx: 'JSX',
						css: 'CSS',
						html: 'HTML',
						txt: 'Plain Text',
						'': 'Unspecified'
					}
				}),
				directivesPlugin({
					directiveDescriptors: [
						// YoutubeDirectiveDescriptor,
						AdmonitionDirectiveDescriptor
					]
				}),
				diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
				markdownShortcutPlugin()
			]}
		/>
	)
}
