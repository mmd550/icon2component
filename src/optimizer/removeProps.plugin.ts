const nodes = ["svg"];

const attrs = ["width", "height", "fill"];

const removePropsPlugin = {
  name: "remove-props",
  fn: () => {
    return {
      element: {
        enter: (node: any) => {
          if (nodes.includes(node.name)) {
            for (let attr of attrs) {
              if (attr in node.attributes) {
                delete node.attributes[attr];
              }
            }
          }
        },
      },
    };
  },
};

export default removePropsPlugin;
