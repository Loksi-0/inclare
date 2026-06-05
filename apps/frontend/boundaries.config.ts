const boundariesConfig = {
  settings: [
    { type: 'shared', pattern: 'src/shared/**', mode: 'file' },
    { type: 'components', pattern: 'src/components/**', mode: 'folder' },
    { type: 'widgets', pattern: 'src/widgets/**', mode: 'folder' },
    { type: 'api', pattern: 'src/api', mode: 'folder' },
    { type: 'services', pattern: 'src/api/services', mode: 'file' },
    { type: 'stores', pattern: 'src/api/stores', mode: 'file' },
    { type: 'routes', pattern: 'src/app/\\(routes\\)/**', mode: 'file' },
    { type: 'icons', pattern: 'src/icons', mode: 'file' },
    { type: 'layouts', pattern: 'src/layouts/**', mode: 'file' },
    { type: 'types', pattern: 'src/types/**', mode: 'file' }
  ],

  dependencies: [
    2,
    {
      default: 'disallow',
      rules: [
        {
          from: { type: 'routes' },
          allow: {
            to: { type: 'widgets', path: ['**/index.ts', '**/index.tsx'] }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        },
        {
          from: { type: '*' },
          allow: {
            to: {
              type: ['components', 'layouts'],
              path: ['**/index.ts', '**/index.tsx']
            }
          },
          message:
            'Папку {{to.type}} можно использовать только через Public API'
        },
        {
          from: { type: '*' },
          allow: {
            to: {
              type: ['shared', 'api', 'icons', 'types']
            }
          }
        }
      ]
    }
  ]
}

export default boundariesConfig
