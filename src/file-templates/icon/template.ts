import * as svgson from 'svgson'

async function iconTemplate(
  svgString: string,
  variables: { componentName: string },
) {
  const parsedSvg = await svgson.parse(svgString)
  const children = parsedSvg.children.reduce((prevValue, child) => {
    return prevValue + svgson.stringify(child)
  }, '')

  const rootProps = Object.entries(parsedSvg.attributes).reduce(
    (prev, entry) => {
      return prev + ` ${entry[0]}="${entry[1]}"`
    },
    '',
  )

  return `
  import { SvgIcon, SvgIconProps } from "@mui/material";

  const ${variables.componentName} = (props: SvgIconProps) => {
    return (
      <SvgIcon${rootProps} {...props}>
            ${children}
      </SvgIcon>
    );
  };

  export default ${variables.componentName}
  `
}

export default iconTemplate
