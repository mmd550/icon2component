function muiTemplate(variables, { tpl }) {
  // Change the svg container to MUI's SvgIcon
  variables.jsx.openingElement.name.name = 'SvgIcon'
  variables.jsx.closingElement.name.name = 'SvgIcon'

  // Append a {...other} to the opening element's attributes
  variables.jsx.openingElement.attributes.push({
    type: 'JSXSpreadAttribute',
    argument: {
      type: 'Identifier',
      name: 'props',
    },
  })

  return tpl`
  // template: mui
  import * as React from "react";
  import { SvgIcon, SvgIconProps } from "@mui/material";
  
  const ${variables.componentName} = (props: SvgIconProps) => {
    return (
      ${variables.jsx}
    );
  };
   
  ${variables.exports};
  `
}

module.exports = muiTemplate
