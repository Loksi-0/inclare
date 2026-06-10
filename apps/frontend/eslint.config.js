import { nextJsConfig } from '@repo/eslint-config/next-js'
import boundariesConfig from './boundaries.config.ts'
import { defineConfig } from 'eslint/config'

const frontendConfig = defineConfig([
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'boundaries/elements': boundariesConfig.settings
    },
    rules: {
      'boundaries/dependencies': boundariesConfig.dependencies
    }
  }
])

export default frontendConfig
