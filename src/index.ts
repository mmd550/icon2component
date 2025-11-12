#! /usr/bin/env node

import FileSystem from './files'
import formatter from './formatter'
import optimizer from './optimizer'
import yargs, { type ArgumentsCamelCase } from 'yargs'
import { hideBin } from 'yargs/helpers'
import iconTemplate from './file-templates/icon/template'
import pureIconTemplate from './file-templates/icon/pure-template'
import indexTemplate from './file-templates/index/template'
import logger from './logger'
import * as changeCase from 'change-case'

type Template = 'mui' | 'pure'

type MakeCommandOptions = {
  sourceDir: string
  outDir: string
  template?: Template
  deep?: boolean
  keepColors?: boolean
  ignoreExisting?: boolean
  camelCaseAttrs?: boolean
}

type MakeCommandArgs = ArgumentsCamelCase<MakeCommandOptions>
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

const printHelp = () => {
  const helpLines = [
    '',
    'Usage:',
    '  icon2component <command> [options]',
    '',
    'Commands:',
    '  make <sourceDir>               Convert SVG icons to React components',
    '',
    'Make command options:',
    '  --out-dir <path>               Output directory for generated components (required)',
    '  --template <mui|pure>                 Use the Material UI SvgIcon template',
    '  --keep-colors                  Preserve source fill and stroke colors',
    '  --camel-case-attrs             Convert dashed SVG attributes to camelCase',
    '  --deep                         Traverse source directories recursively',
    '  --ignore-existing              Skip icons that already exist in the output directory',
    '',
    'Global options:',
    '  --help                         Show help',
    '  --version                      Show version number',
    '',
  ]

  helpLines.forEach(line => logger.log(line))
}

const commands = {
  async createComponents({
    sourceDir,
    outDir,
    deep = false,
    keepColors = false,
    ignoreExisting = false,
    camelCaseAttrs = false,
    template,
  }: MakeCommandArgs) {
    const { optimize } = optimizer({ keepColors, camelCaseAttrs })

    if (!outDir || !sourceDir) {
      logger.error(
        'Please provide source and output paths\n',
        'example: icon2component make --out-dir <out-dir> <source-dir>',
      )
      return
    }

    const fs = new FileSystem({
      src: sourceDir,
      output: outDir,
      deep,
    })

    const pathsTree = await fs.getPathsTree()

    for (let directory in pathsTree) {
      const dir = pathsTree[directory]
      const icons = dir.iconPaths
      const outDir = dir.outDir
      const indexPath = dir.indexFilePath
      await fs.createDir(outDir)
      const convertedIcons = []

      for (let icon of icons) {
        if (ignoreExisting && icon.alreadyExists) continue
        const { format } = await formatter({
          filePath: icon.outputFilePath,
          options: {
            parser: 'babel-ts',
          },
        })
        const svgString = await fs.readFile(icon.sourceFilePath)
        const optimizedSvg = await optimize(svgString)

        const component =
          template === 'mui'
            ? await iconTemplate(optimizedSvg, {
                componentName: changeCase.pascalCase(icon.name) + 'Icon',
              })
            : await pureIconTemplate(optimizedSvg, {
                componentName: changeCase.pascalCase(icon.name) + 'Icon',
              })

        const formattedComponent = await format(component)

        await fs.writeFile(icon.outputFilePath, formattedComponent)
        convertedIcons.push({
          path: icon.outputFilePath,
          originalPath: icon.sourceFilePath,
        })
      }

      const newIndexFile = indexTemplate(convertedIcons)
      const oldIndexFile = await fs.readFile(indexPath)

      const mergedIndexFile = await mergeIndexes(
        oldIndexFile,
        newIndexFile,
        indexPath,
      )
      await fs.writeFile(indexPath, mergedIndexFile)
    }

    logger.success(`icons converted and added to ${outDir} successfully.`)
  },
}

const rawArgs = hideBin(process.argv)

const wantsHelp =
  rawArgs.length === 0 ||
  rawArgs.includes('--help') ||
  rawArgs.includes('-h') ||
  rawArgs[0] === 'help'

if (wantsHelp) {
  printHelp()
  process.exit(0)
}

const cli = yargs(rawArgs)
  .scriptName('icon2component')
  .usage('$0 <command> [options]')
  .command<MakeCommandOptions>(
    'make <sourceDir>',
    'Convert SVG icons to React components',
    cmd =>
      cmd
        .positional('sourceDir', {
          describe: 'Directory containing source SVG files',
          type: 'string',
        })
        .option('out-dir', {
          alias: ['outDir', 'outdir'],
          type: 'string',
          describe: 'Output directory for generated components',
          demandOption: true,
        })
        .option('template', {
          choices: ['mui'] as const,
          describe: 'Use the Material UI SvgIcon template',
        })
        .option('keep-colors', {
          alias: ['keepColors', 'keepcolors'],
          type: 'boolean',
          describe: 'Preserve source fill and stroke colors',
          default: false,
        })
        .option('camel-case-attrs', {
          alias: ['camelCaseAttrs', 'camelcaseattrs'],
          type: 'boolean',
          describe: 'Convert dashed SVG attributes to camelCase',
          default: false,
        })
        .option('deep', {
          type: 'boolean',
          describe: 'Traverse source directories recursively',
          default: false,
        })
        .option('ignore-existing', {
          alias: ['ignoreExisting', 'ignoreexisting'],
          type: 'boolean',
          describe: 'Skip icons that already exist in the output directory',
          default: false,
        }),
    async args => {
      await commands.createComponents(args)
    },
  )
  .strict()

cli.parse()
