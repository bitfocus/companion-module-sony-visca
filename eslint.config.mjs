import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({})

const customConfig = [
	...baseConfig,

	{
		languageOptions: {
			sourceType: 'module',
		},
	},
	{
		ignores: ['test/'],
	},
]

export default customConfig
