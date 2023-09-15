const template = require('./templates/mui/template.ts')
const indexTemplate = require('./templates/index/template.ts')
const prettierConfig = require('./.prettierrc.json')

// module.exports = {
//   icon: true,
//   typescript: true,
//   memo: false,
//   template,
//   indexTemplate,
//   ignoreExisting: false,
//   filenameCase: 'kebab',
//   prettierConfig,

//   jsx: {
//     babelConfig: {
//       plugins: [
//         [
//           '@svgr/babel-plugin-remove-jsx-attribute',
//           {
//             elements: ['SvgIcon'],
//             attributes: ['width', 'height', 'fill'],
//           },
//         ],
//         [
//           '@svgr/babel-plugin-add-jsx-attribute',
//           {
//             elements: [
//               'path',
//               'circle',
//               'ellipse',
//               'line',
//               'polygon',
//               'polyline',
//               'rect',
//             ],
//             attributes: [
//               {
//                 name: 'fill',
//                 value: 'currentColor',
//                 spread: false,
//                 literal: false,
//               },
//             ],
//           },
//         ],
//       ],
//     },
//   },
// }
module.exports = {}
