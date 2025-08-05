const nodes = ['svg']
const attrs: { attr: string; shouldDelete?: (value: string) => boolean }[] = [
  { attr: 'width' },
  { attr: 'height' },
  {
    attr: 'fill',
    shouldDelete(value) {
      return value !== 'none'
    },
  },
]

const removePropsPlugin = {
  name: 'remove-props',
  fn: () => {
    return {
      element: {
        enter: (node: any) => {
          if (nodes.includes(node.name)) {
            for (let attr of attrs) {
              if (attr.attr in node.attributes) {
                const value = node.attributes[attr.attr]
                if (!attr.shouldDelete || attr.shouldDelete(value))
                  delete node.attributes[attr.attr]
              }
            }
          }
        },
      },
    }
  },
}

export default removePropsPlugin
