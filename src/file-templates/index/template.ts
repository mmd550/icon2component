import path from 'path'
import { pascalCase } from 'change-case'

function indexTemplate(filePaths: { path: string; originalPath: string }[]) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath))
    const exportName = /^\d/.test(basename)
      ? `Svg${basename}Icon`
      : `${pascalCase(basename)}Icon`
    return `export { default as ${exportName} } from './${basename}'`
  })
  return exportEntries.join('\n')
}

export default indexTemplate
