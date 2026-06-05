import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import { baseConfig } from './base.js'

export const honoConfig = defineConfig([
  ...baseConfig,
  {
    rules: {
      'no-non-null-assertion': 'off',
      'no-console': 'off'
    }
  }
])
