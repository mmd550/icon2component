import * as changeCase from 'change-case'
const excludeAttrs = []

const camelCaseAttrsPlugin = {
  name: "remove-props",
  fn: () => {
    return {
      element: {
        enter: (node: any) => {
            for(const attr in node.attributes){
              if(!excludeAttrs.includes(attr)){
                const attrValue = node.attributes[attr]
                delete node.attributes[attr];
                node.attributes[changeCase.camelCase(attr)]=attrValue
              }
            }
        },
      },
    };
  },
};

export default camelCaseAttrsPlugin;
