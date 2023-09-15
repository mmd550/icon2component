const { optimize: svgoOptimize } = require('svgo')
const removeColorsPlugin = require('./removeColors.plugin')
const removePropsPlugin = require('./removeProps.plugin')

function optimizer(options) {
  const { keepColors = false } = options || {}

  async function optimize(svgString) {
    return new Promise(resolve => {
      const result = svgoOptimize(svgString, {
        plugins: [
          ...(!keepColors ? [removeColorsPlugin] : []),
          removePropsPlugin,
        ],
      })
      resolve(result.data)
    })
  }

  return { optimize }
}

module.exports = optimizer
