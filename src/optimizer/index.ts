import * as svgo from 'svgo'
import replaceColorsPlugin from './replaceColors.plugin'
import removePropsPlugin from './removeProps.plugin'
import camelCaseAttrsPlugin from './camelCaseAttrs.plugin'
interface Props {
  keepColors?: boolean
  camelCaseAttrs?:boolean
}
function optimizer({ keepColors = false,camelCaseAttrs=false }: Props) {
  async function optimize(svgString: string) {
    return new Promise<string>(resolve => {
      const result = svgo.optimize(svgString, {
        plugins: [
          removePropsPlugin,
          ...(!keepColors ? [replaceColorsPlugin] : []),
          ...(camelCaseAttrs ?[camelCaseAttrsPlugin]: []),
        ],
      })
      resolve(result.data)
    })
  }

  return { optimize }
}

export default optimizer
