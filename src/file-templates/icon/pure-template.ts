import * as svgson from 'svgson'

async function pureIconTemplate(
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
  import { type ComponentProps } from 'react'

  const ${variables.componentName} = (props: ComponentProps<'svg'>) => {
    return (
      <svg${rootProps} {...props}>
            ${children}
      </svg>
    );
  };

  export default ${variables.componentName}
  `
}

export default pureIconTemplate
