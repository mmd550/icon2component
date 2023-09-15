const nodes = [
  "path",
  "circle",
  "ellipse",
  "line",
  "polygon",
  "polyline",
  "rect",
];

const colorAttrs = ["stroke", "fill"];

const replaceColorsPlugin = {
  name: "replace-colors",
  fn: () => {
    return {
      element: {
        enter: (node: any) => {
          if (nodes.includes(node.name)) {
            for (let colorAttr of colorAttrs) {
              if (colorAttr in node.attributes) {
                node.attributes[colorAttr] = "currentColor";
              }
            }
          }
        },
      },
    };
  },
};

export default replaceColorsPlugin;
