#! /usr/bin/env node

var $bJK8m$process = require('process')
var $bJK8m$yargs = require('yargs')
var $bJK8m$yargshelpers = require('yargs/helpers')
var $bJK8m$changecase = require('change-case')
var $bJK8m$nodefspromises = require('node:fs/promises')
var $bJK8m$nodepath = require('node:path')
var $bJK8m$prettier = require('prettier')
var $bJK8m$svgo = require('svgo')
var $bJK8m$svgson = require('svgson')
var $bJK8m$path = require('path')

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a
}

async function $0bdad519c81a4208$var$files({
  src: src,
  output: output,
  deep: deep = false,
  ext: ext = 'tsx',
  casing: casing = 'paramCase',
}) {
  const pathsTree = {}
  async function isDir(path) {
    return (await $bJK8m$nodefspromises.lstat(path)).isDirectory()
  }
  async function fileExists(path) {
    try {
      const file = await $bJK8m$nodefspromises.open(path, 'r')
      file.close()
      return true
    } catch (err) {
      return false
    }
  }
  async function readFile(path) {
    try {
      const file = await $bJK8m$nodefspromises.open(path, 'r')
      const read = await file.readFile({
        encoding: 'utf-8',
      })
      file.close()
      return read
    } catch (err) {
      return ''
    }
  }
  async function writeFile(path, data) {
    const file = await $bJK8m$nodefspromises.open(path, 'w')
    file.writeFile(data)
    file.close()
  }
  async function createDir(path) {
    await $bJK8m$nodefspromises.mkdir(path, {
      recursive: true,
    })
  }
  async function calculatePaths(source) {
    const filePaths = await $bJK8m$nodefspromises.readdir(source)
    const outDir = $bJK8m$nodepath.join(
      output,
      source.replace($bJK8m$nodepath.join(src), ''),
    )
    pathsTree[source] = {
      iconPaths: [],
      indexFilePath: $bJK8m$nodepath.join(outDir, 'index.ts'),
      outDir: outDir,
    }
    for (let filePath of filePaths) {
      const wholePath = $bJK8m$nodepath.join(source, filePath)
      const isDirectory = await isDir(wholePath)
      if (!isDirectory && $bJK8m$nodepath.extname(filePath) !== '.svg') continue
      if (isDirectory) {
        if (deep) calculatePaths(wholePath)
      } else {
        const parsed = $bJK8m$nodepath.parse(wholePath)
        const name = parsed.name
        const casedName = $bJK8m$changecase[casing](name)
        const out = $bJK8m$nodepath.join(
          output,
          parsed.dir.replace($bJK8m$nodepath.join(src), ''),
        )
        const outputFilePath = $bJK8m$nodepath.join(out, `${casedName}.${ext}`)
        const alreadyExists = await fileExists(outputFilePath)
        pathsTree[source].iconPaths.push({
          sourceFilePath: wholePath,
          outputFilePath: outputFilePath,
          alreadyExists: alreadyExists,
          name: name,
        })
      }
    }
  }
  function getPathsTree() {
    return pathsTree
  }
  await calculatePaths(src)
  return {
    getPathsTree: getPathsTree,
    fileExists: fileExists,
    readFile: readFile,
    writeFile: writeFile,
    createDir: createDir,
  }
}
var $0bdad519c81a4208$export$2e2bcd8739ae039 = $0bdad519c81a4208$var$files

function $e0be73ff08a04b5b$var$success(...message) {
  const prefix = '\uD83D\uDE42\uD83D\uDC4D '
  console.log(prefix, ...message)
}
function $e0be73ff08a04b5b$var$log(...message) {
  console.log(...message)
}
function $e0be73ff08a04b5b$var$error(...message) {
  const prefix = '☹️\uD83D\uDC4E '
  console.log(prefix, ...message)
}
const $e0be73ff08a04b5b$var$logger = {
  error: $e0be73ff08a04b5b$var$error,
  success: $e0be73ff08a04b5b$var$success,
  log: $e0be73ff08a04b5b$var$log,
}
var $e0be73ff08a04b5b$export$2e2bcd8739ae039 = $e0be73ff08a04b5b$var$logger

const $828de298aa5cb913$var$prettierDefaultConfig = {}
async function $828de298aa5cb913$var$formatter({
  filePath: filePath,
  options: options,
}) {
  const configFilePath = filePath
    ? await $bJK8m$prettier.resolveConfigFile(filePath)
    : ''
  const resolvedConfig = configFilePath
    ? require(configFilePath)
    : $828de298aa5cb913$var$prettierDefaultConfig
  const formatterErrorMessage = '--icon-cli-formatter-error'
  async function format(source) {
    try {
      const result = await $bJK8m$prettier.format(source, {
        ...(resolvedConfig || {}),
        parser: 'babel',
        ...(options || {}),
      })
      return result
    } catch (err) {
      ;(0, $e0be73ff08a04b5b$export$2e2bcd8739ae039).error(
        'error happened when formatting file: ',
        err,
      )
      throw new Error(formatterErrorMessage)
    }
  }
  return {
    format: format,
    formatterErrorMessage: formatterErrorMessage,
  }
}
var $828de298aa5cb913$export$2e2bcd8739ae039 = $828de298aa5cb913$var$formatter

const $19be78e597493116$var$nodes = [
  'path',
  'circle',
  'ellipse',
  'line',
  'polygon',
  'polyline',
  'rect',
]
const $19be78e597493116$var$colorAttrs = ['stroke', 'fill']
const $19be78e597493116$var$replaceColorsPlugin = {
  name: 'replace-colors',
  fn: () => {
    return {
      element: {
        enter: node => {
          if ($19be78e597493116$var$nodes.includes(node.name)) {
            for (let colorAttr of $19be78e597493116$var$colorAttrs)
              if (colorAttr in node.attributes)
                node.attributes[colorAttr] = 'currentColor'
          }
        },
      },
    }
  },
}
var $19be78e597493116$export$2e2bcd8739ae039 =
  $19be78e597493116$var$replaceColorsPlugin

const $d4a236dd22c4bd73$var$nodes = ['svg']
const $d4a236dd22c4bd73$var$attrs = ['width', 'height', 'fill']
const $d4a236dd22c4bd73$var$removePropsPlugin = {
  name: 'remove-props',
  fn: () => {
    return {
      element: {
        enter: node => {
          if ($d4a236dd22c4bd73$var$nodes.includes(node.name)) {
            for (let attr of $d4a236dd22c4bd73$var$attrs)
              if (attr in node.attributes) delete node.attributes[attr]
          }
        },
      },
    }
  },
}
var $d4a236dd22c4bd73$export$2e2bcd8739ae039 =
  $d4a236dd22c4bd73$var$removePropsPlugin

function $80b0c4bbc911eab8$var$optimizer(options) {
  const { keepColors: keepColors = false } = options || {}
  async function optimize(svgString) {
    return new Promise(resolve => {
      const result = $bJK8m$svgo.optimize(svgString, {
        plugins: [
          ...(!keepColors
            ? [(0, $19be78e597493116$export$2e2bcd8739ae039)]
            : []),
          (0, $d4a236dd22c4bd73$export$2e2bcd8739ae039),
        ],
      })
      resolve(result.data)
    })
  }
  return {
    optimize: optimize,
  }
}
var $80b0c4bbc911eab8$export$2e2bcd8739ae039 = $80b0c4bbc911eab8$var$optimizer

async function $3cd2a40a1f289e78$var$iconTemplate(svgString, variables) {
  const parsedSvg = await $bJK8m$svgson.parse(svgString)
  const children = parsedSvg.children.reduce((prevValue, child) => {
    return prevValue + $bJK8m$svgson.stringify(child)
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
var $3cd2a40a1f289e78$export$2e2bcd8739ae039 =
  $3cd2a40a1f289e78$var$iconTemplate

function $fb7d4313633f5a8e$var$indexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = (0, $parcel$interopDefault($bJK8m$path)).basename(
      filePath,
      (0, $parcel$interopDefault($bJK8m$path)).extname(filePath),
    )
    const exportName = /^\d/.test(basename)
      ? `Svg${basename}Icon`
      : `${(0, $bJK8m$changecase.pascalCase)(basename)}Icon`
    return `export { default as ${exportName} } from './${basename}'`
  })
  return exportEntries.join('\n')
}
var $fb7d4313633f5a8e$export$2e2bcd8739ae039 =
  $fb7d4313633f5a8e$var$indexTemplate

const $882b6d93070905b3$var$argv = (0, $parcel$interopDefault($bJK8m$yargs))(
  (0, $bJK8m$yargshelpers.hideBin)($bJK8m$process.argv),
).argv
async function $882b6d93070905b3$var$mergeIndexes(
  rawOldIndexFile,
  rawNewIndexFile,
  indexPath,
) {
  const { format: format } = await (0,
  $828de298aa5cb913$export$2e2bcd8739ae039)({
    filePath: indexPath,
    options: {
      parser: 'babel-ts',
    },
  })
  const newIndexFile = await format(rawNewIndexFile)
  const oldIndexFile = await format(rawOldIndexFile)
  const newIndexFileArr = newIndexFile
    .split('\n')
    .filter(line => line && line !== '\n' && line !== '\r\n')
  const oldIndexFileArr = oldIndexFile
    .split('\n')
    .filter(line => line && line !== '\n' && line !== '\r\n')
  newIndexFileArr.forEach(line => {
    if (!oldIndexFileArr.includes(line)) oldIndexFileArr.push(line)
  })
  return oldIndexFileArr.join('\n')
}
function $882b6d93070905b3$var$getArgs() {
  const sourceDir = $882b6d93070905b3$var$argv['_'][1]
  const outDir =
    $882b6d93070905b3$var$argv['outdir'] ||
    $882b6d93070905b3$var$argv['outDir'] ||
    $882b6d93070905b3$var$argv['out-dir']
  const deep = $882b6d93070905b3$var$argv['deep']
  const keepColors =
    $882b6d93070905b3$var$argv['keepColors'] ||
    $882b6d93070905b3$var$argv['keep-colors'] ||
    $882b6d93070905b3$var$argv['keepcolors']
  const mui = $882b6d93070905b3$var$argv['mui']
  const ignoreExisting =
    $882b6d93070905b3$var$argv['ignoreExisting'] ||
    $882b6d93070905b3$var$argv['ignore-existing'] ||
    $882b6d93070905b3$var$argv['ignoreexisting']
  return {
    sourceDir: sourceDir,
    outDir: outDir,
    deep: deep,
    keepColors: keepColors,
    mui: mui,
    ignoreExisting: ignoreExisting,
  }
}
async function $882b6d93070905b3$var$bootstrap() {
  if (/(make)/.test($882b6d93070905b3$var$argv['_'][0])) {
    await $882b6d93070905b3$var$commands.createComponents()
    return
  }
}
const $882b6d93070905b3$var$commands = {
  async createComponents() {
    const {
      sourceDir: sourceDir,
      outDir: outDir,
      deep: deep,
      keepColors: keepColors,
      ignoreExisting: ignoreExisting,
    } = $882b6d93070905b3$var$getArgs()
    const { optimize: optimize } = (0,
    $80b0c4bbc911eab8$export$2e2bcd8739ae039)({
      keepColors: keepColors,
    })
    if (!outDir || !sourceDir) {
      ;(0, $e0be73ff08a04b5b$export$2e2bcd8739ae039).error(
        'Please provide source and output paths\n',
        'example: iconlite make --out-dir <out-dir> <source-dir>',
      )
      return
    }
    const {
      getPathsTree: getPathsTree,
      createDir: createDir,
      readFile: readFile,
      writeFile: writeFile,
    } = await (0, $0bdad519c81a4208$export$2e2bcd8739ae039)({
      src: sourceDir,
      output: outDir,
      deep: deep,
    })
    const pathsTree = getPathsTree()
    for (let directory in pathsTree) {
      const dir = pathsTree[directory]
      const icons = dir.iconPaths
      const outDir = dir.outDir
      const indexPath = dir.indexFilePath
      await createDir(outDir)
      const convertedIcons = []
      for (let icon of icons) {
        if (ignoreExisting && icon.alreadyExists) continue
        const { format: format } = await (0,
        $828de298aa5cb913$export$2e2bcd8739ae039)({
          filePath: icon.outputFilePath,
          options: {
            parser: 'babel-ts',
          },
        })
        const svgString = await readFile(icon.sourceFilePath)
        const optimizedSvg = await optimize(svgString)
        await writeFile(icon.sourceFilePath, optimizedSvg)
        const component = await (0, $3cd2a40a1f289e78$export$2e2bcd8739ae039)(
          svgString,
          {
            componentName: $bJK8m$changecase.pascalCase(icon.name) + 'Icon',
          },
        )
        const formattedComponent = await format(component)
        await writeFile(icon.outputFilePath, formattedComponent)
        convertedIcons.push({
          path: icon.outputFilePath,
          originalPath: icon.sourceFilePath,
        })
      }
      const newIndexFile = (0, $fb7d4313633f5a8e$export$2e2bcd8739ae039)(
        convertedIcons,
      )
      const oldIndexFile = await readFile(indexPath)
      const mergedIndexFile = await $882b6d93070905b3$var$mergeIndexes(
        oldIndexFile,
        newIndexFile,
        indexPath,
      )
      await writeFile(indexPath, mergedIndexFile)
    }
    ;(0, $e0be73ff08a04b5b$export$2e2bcd8739ae039).success(
      `icons converted and added to ${outDir} successfully.`,
    )
  },
}
$882b6d93070905b3$var$bootstrap()

//# sourceMappingURL=main.js.map
