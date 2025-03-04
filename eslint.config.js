import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

const baseConfig = [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...ts.configs.recommended,
  importPlugin.flatConfigs.recommended,
]

export default [
  ...baseConfig.map(ruleErrorToWarn),
  // custom config
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/parameter-properties': 'error',
      'import/extensions': ['error', 'ignorePackages', { ts: 'always', js: 'never' }],
    },
  },
]

function ruleErrorToWarn(rule) {
  if ('rules' in rule) {
    return {
      ...rule,
      rules: Object.fromEntries(
        Object.entries(rule.rules).map(([key, value]) => [key, value === 'error' ? 'warn' : value])
      ),
    }
  }

  return rule
}
