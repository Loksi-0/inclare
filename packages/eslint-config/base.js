import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import onlyWarn from 'eslint-plugin-only-warn'
import { defineConfig } from 'eslint/config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'

export const baseConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      turbo: turboPlugin,
      '@typescript-eslint': tsPlugin,
      onlyWarn,
      'prefer-arrow-functions': preferArrowFunctions,
      prettier
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      ...tsPlugin.configs['strict-type-checked'].rules,

      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          singleAttributePerLine: true,
          arrowParens: 'always'
        }
      ],

      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowedNames: [],
          allowNamedFunctions: false,
          allowObjectProperties: false,
          classPropertiesAllowed: true,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false
        }
      ],

      'turbo/no-undeclared-env-vars': 'warn',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-undef': 'off',
      'no-else-return': 'warn',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[a-z_]' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[a-z_]' }
      ],
      '@typescript-eslint/no-misused-spread': 'off'
    }
  },
  {
    ignores: [
      'dist/**',
      'out/**',
      'build/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts'
    ]
  }
])
