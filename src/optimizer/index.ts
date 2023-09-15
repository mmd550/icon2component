import * as svgo from 'svgo'
import replaceColorsPlugin from './replaceColors.plugin'
import removePropsPlugin from './removeProps.plugin'
interface Props {
  keepColors?: boolean
}
function optimizer({ keepColors = false }: Props) {
  async function optimize(svgString: string) {
    return new Promise<string>(resolve => {
      const result = svgo.optimize(svgString, {
        plugins: [
          removePropsPlugin,
          ...(!keepColors ? [replaceColorsPlugin] : []),
        ],
      })
      resolve(result.data)
    })
  }

  return { optimize }
}

export default optimizer
