#! /usr/bin/env node
'use strict'

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const args = yargs(hideBin(process.argv)).argv
const formatter = require('./formatter')
const logger = require('./logger')
const optimizer = require('./optimizer')
const files = require('./files')
const svgr = require('@svgr/core')
const changeCase = require('change-case')

const muiTemplate = require('../templates/mui/template.ts')
const defaultTemplate = require('../templates/default/template.ts')
const indexTemplate = require('../templates/index/template.ts')

function getSvgrConfig() {
  return {
    icon: true,
    typescript: true,
    plugins: ['@svgr/plugin-jsx'],
    prettier: false,
    svgo: false,
    memo: false,
    template: args['mui'] ? muiTemplate : defaultTemplate,
  }
}

async function mergeIndexes(rawOldIndexFile, rawNewIndexFile, indexPath) {
  const { format } = await formatter({
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
    if (!oldIndexFileArr.includes(line)) {
      oldIndexFileArr.push(line)
    }
  })

  return oldIndexFileArr.join('\n')
}

function getArgs() {
  const sourceDir = args['_'][1]
  const outDir = args['outdir'] || args['outDir'] || args['out-dir']
  const deep = args['deep']
  const keepColors =
    args['keepColors'] || args['keep-colors'] || args['keepcolors']
  const mui = args['mui']
  const ignoreExisting =
    args['ignoreExisting'] || args['ignore-existing'] || args['ignoreexisting']

  return { sourceDir, outDir, deep, keepColors, mui, ignoreExisting }
}

async function bootstrap() {
  if (/(make)/.test(args['_'][0])) {
    await commands.createComponents()
    return
  }
}

const commands = {
  async createComponents() {
    const { sourceDir, outDir, deep, keepColors, ignoreExisting } =
      getArgs()
    const svgrConfig = getSvgrConfig()
    const { optimize } = optimizer({ keepColors })

    if (!outDir || !sourceDir) {
      logger.error(
        'Please provide source and output paths\n',
        'example: iconlite make --out-dir <out-dir> <source-dir>',
      )
      return
    }

    const { getPathsTree, createDir, readFile, writeFile } = await files({
      src: sourceDir,
      output: outDir,
      deep,
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
        const { format } = await formatter({
          filePath: icon.outputFilePath,
          options: {
            parser: 'babel-ts',
          },
        })
        const svgString = await readFile(icon.sourceFilePath)
        const optimizedSvg = await optimize(svgString)

        const component = await svgr.transform(optimizedSvg, svgrConfig, {
          componentName: changeCase.pascalCase(icon.name) + 'Icon',
          filePath: icon.outputFilePath,
        })
        const newComponent = component.replace(/\/\/{{enter}}/g, '\n')
        const formattedComponent = await format(newComponent)

        await writeFile(icon.outputFilePath, formattedComponent)
        convertedIcons.push({
          path: icon.outputFilePath,
          originalPath: icon.sourceFilePath,
        })
      }

      const newIndexFile = indexTemplate(convertedIcons)
      const oldIndexFile = await readFile(indexPath)

      const mergedIndexFile = await mergeIndexes(
        oldIndexFile,
        newIndexFile,
        indexPath,
      )
      await writeFile(indexPath, mergedIndexFile)
    }
  },
}

bootstrap()
