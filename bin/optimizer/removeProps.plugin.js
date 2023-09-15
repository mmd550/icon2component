const nodes = ['svg']

const attrs = ['width', 'height', 'fill']

const removeProps = {
  name: 'remove-props',
  fn: () => {
    return {
      element: {
        enter: node => {
          if (nodes.includes(node.name)) {
            for (let attr of attrs) {
              if (attr in node.attributes) {
                delete node.attributes[attr]
              }
            }
          }
        },
      },
    }
  },
}

module.exports = removeProps
