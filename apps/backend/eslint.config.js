import { honoConfig } from '@repo/eslint-config/hono'
import { defineConfig } from 'eslint/config'

const backendConfig = defineConfig([
  ...honoConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    ignores: ['prisma/generated/**']
  }
])

export default backendConfig
