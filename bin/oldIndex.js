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
  const prefix = '🙂👍 '

  console.log(prefix, ...message)
}

function logError(...message) {
  const prefix = '☹️👎 '

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

const PrettifyError = 'prettify-error'
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
    logError('error happened when prettifying file: ', err.message)
    throw new Error(PrettifyError)
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
    } catch (err) {
      if (err.message !== PrettifyError) {
        logError("couldn't read index file! ", err.message)
      }
      return
    }

    const configPath = path.join(__dirname.slice(0, -3), '.svgrrc.js')
    try {
      await execute(
        `svgr --config-file ${configPath} --out-dir ${outDir} -- ${sourceDir}`,
      )
    } catch (err) {
      logError("couldn't convert!", err.message)
    }

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
        const newIndexFileArr = newIndexFile
          .split('\n')
          .filter(line => line !== '\n')
        const prevIndexFileArr = prevIndexFile
          .split('\n')
          .filter(line => line && line !== '\n' && line !== '\r\n')

        newIndexFileArr.forEach(line => {
          if (!prevIndexFileArr.includes(line)) {
            prevIndexFileArr.push(line)
          }
        })

        const resultIndexFile = prevIndexFileArr.join('\n')
        await fs.writeFile(indexFilePath, resultIndexFile)
        message(`Icon files converted and added to ${outDir}`)
      } catch (err) {
        err.message !== PrettifyError && logError(err.message)
      }
    }
  }

  return { createIconComponents }
}

bootstrap()
