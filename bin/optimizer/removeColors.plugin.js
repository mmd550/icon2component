const nodes = [
  'path',
  'circle',
  'ellipse',
  'line',
  'polygon',
  'polyline',
  'rect',
]

const colorAttrs = ['stroke', 'fill']

const removeHardCodedColors = {
  name: 'replace-colors',
  fn: () => {
    return {
      element: {
        enter: node => {
          if (nodes.includes(node.name)) {
            for (let colorAttr of colorAttrs) {
              if (colorAttr in node.attributes) {
                node.attributes[colorAttr] = 'currentColor'
              }
            }
          }
        },
      },
    }
  },
}

module.exports = removeHardCodedColors
