#! /usr/bin/env node

import files from './files'
import formatter from './formatter'
import optimizer from './optimizer'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import iconTemplate from './file-templates/icon/template'
import indexTemplate from './file-templates/index/template'
import logger from './logger'
import * as changeCase from 'change-case'

const argv = yargs(hideBin(process.argv)).argv

async function mergeIndexes(
  rawOldIndexFile: string,
  rawNewIndexFile: string,
  indexPath: string,
) {
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
    .filter((line: string) => line && line !== '\n' && line !== '\r\n')

  const oldIndexFileArr = oldIndexFile
    .split('\n')
    .filter((line: string) => line && line !== '\n' && line !== '\r\n')

  newIndexFileArr.forEach((line: string) => {
    if (!oldIndexFileArr.includes(line)) {
      oldIndexFileArr.push(line)
    }
  })

  return oldIndexFileArr.join('\n')
}

function getArgs() {
  const sourceDir: string | undefined = argv['_'][1]
  const outDir: string | undefined =
    argv['outdir'] || argv['outDir'] || argv['out-dir']
  const deep: boolean | undefined = argv['deep']
  const keepColors: boolean | undefined =
    argv['keepColors'] || argv['keep-colors'] || argv['keepcolors']
  const mui: boolean | undefined = argv['mui']
  const ignoreExisting: boolean | undefined =
    argv['ignoreExisting'] || argv['ignore-existing'] || argv['ignoreexisting']

  return { sourceDir, outDir, deep, keepColors, mui, ignoreExisting }
}

async function bootstrap() {
  if (/(make)/.test(argv['_'][0])) {
    await commands.createComponents()
    return
  }
}

const commands = {
  async createComponents() {
    const { sourceDir, outDir, deep, keepColors, ignoreExisting } = getArgs()
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

        const component = await iconTemplate(optimizedSvg, {
          componentName: changeCase.pascalCase(icon.name) + 'Icon',
        })

        const formattedComponent = await format(component)

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

    logger.success(`icons converted and added to ${outDir} successfully.`)
  },
}

bootstrap()
