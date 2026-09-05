const boundariesConfig = {
  settings: [
    { type: 'shared', pattern: 'src/shared/**', mode: 'file' },
    { type: 'features', pattern: 'src/features/**', mode: 'folder' },
    { type: 'screens', pattern: 'src/screens/**', mode: 'folder' },
    { type: 'app', pattern: 'src/app/**', mode: 'folder' }
  ],

  dependencies: [
    2,
    {
      default: 'disallow',
      rules: [
        {
          from: { type: 'features' },
          allow: {
            to: { type: 'features', path: ['**/index.ts', '**/index.tsx'] }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        },
        {
          from: { type: 'app' },
          allow: {
            to: { type: 'screens', path: ['**/index.ts', '**/index.tsx'] }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        },
        {
          from: { type: 'screens' },
          allow: {
            to: { type: 'features', path: ['**/index.ts', '**/index.tsx'] }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        },
        {
          from: { type: '*' },
          allow: {
            to: {
              type: ['shared'],
              path: ['**/index.ts', '**/index.tsx']
            }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        }
      ]
    }
  ]
}

export default boundariesConfig
