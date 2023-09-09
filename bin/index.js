#! /usr/bin/env node
'use strict'

const { exec } = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const fs = require('fs').promises
const path = require('path')
const prettier = require('prettier')

const prettierDefaultConfig = {}

function message(...message) {
  const prefix = '☺☺☺'

  console.log(prefix, ...message)
}

async function execute(command) {
  return new Promise(function (resolve) {
    exec(command, (err, stdout) => {
      resolve(stdout)
      if (err) {
        message(`exec error: ${err}\n`, 'command: ', command)
      }
    })
  })
}

async function prettify(source, filePath) {
  try {
    const configFilePath = await prettier.resolveConfigFile(filePath)
    let configFile

    if (configFilePath) {
      configFile = require(configFilePath)
    }

    const config = configFile || prettierDefaultConfig
    return await prettier.format(source, {
      ...config,
      parser: 'babel',
    })
  } catch (err) {
    console.log("couldn't prettify")
    return source
  }
}

async function bootstrap() {
  const commandsHandlers = getCommands()
  if (/(-c)|(create)|(make)/.test(argv['_'][0])) {
    await commandsHandlers.createIconComponents()
    return
  }
}

function getCommands() {
  async function createIconComponents() {
    const sourceDir = argv['_'][1]
    const outDir = argv['outdir'] || argv['outDir'] || argv['out-dir']
    if (!outDir || !sourceDir) {
      message(
        'Please provide source and output paths\n',
        'example: iconlite create --out-dir <out-dir> <source-dir>',
      )
      return
    }
    let prevIndexFile
    const indexFilePath = path.join(outDir, 'index.ts')

    try {
      const unFormattedPrevIndexFile = await fs.readFile(indexFilePath, 'utf-8')
      prevIndexFile = await prettify(unFormattedPrevIndexFile, indexFilePath)
    } catch (err) {}

    const configPath = path.join(__dirname.slice(0, -3), '.svgrrc.js')

    await execute(
      `svgr --config-file ${configPath} --out-dir ${outDir} -- ${sourceDir}`,
    )

    if (prevIndexFile) {
      try {
        const unFormattedNewIndexFile = await fs.readFile(
          indexFilePath,
          'utf-8',
        )
        const newIndexFile = await prettify(
          unFormattedNewIndexFile,
          indexFilePath,
        )
        const newIndexFileArr = newIndexFile.split('\n')
        const prevIndexFileArr = prevIndexFile.split('\n')

        newIndexFileArr.forEach(line => {
          if (!prevIndexFileArr.includes(line)) {
            prevIndexFileArr.push(line)
          }
        })

        const resultIndexFile = prevIndexFileArr.join('\n')
        await fs.writeFile(indexFilePath, resultIndexFile)
      } finally {
        message(`Icon files converted and added to ${outDir}`)
      }
    }
  }

  return { createIconComponents }
}

bootstrap()
