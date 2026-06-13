import { honoConfig } from '@repo/eslint-config/hono'
import { defineConfig, globalIgnores } from 'eslint/config'

const backendConfig = defineConfig([
  ...honoConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  globalIgnores(['prisma/generated/**'])
])

export default backendConfig
