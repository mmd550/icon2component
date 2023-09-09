const template = require('./templates/mui/template.ts')
const indexTemplate = require('./templates/index/template.ts')

module.exports = {
  icon: false,
  typescript: true,
  memo: true,
  template,
  indexTemplate,
  ignoreExisting: false,

  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['SvgIcon'],
            attributes: ['width', 'height', 'fill'],
          },
        ],
        [
          '@svgr/babel-plugin-add-jsx-attribute',
          {
            elements: [
              'path',
              'circle',
              'ellipse',
              'line',
              'polygon',
              'polyline',
              'rect',
            ],
            attributes: [
              {
                name: 'fill',
                value: 'currentColor',
                spread: false,
                literal: false,
              },
            ],
          },
        ],
      ],
    },
  },
}
