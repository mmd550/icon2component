const fs = require('fs').promises
const path = require('path')
const changeCase = require('change-case')

async function files({
  src,
  output,
  deep = false,
  ext = 'tsx',
  casing = 'paramCase',
}) {
  const pathsTree = {}

  async function isDir(path) {
    return (await fs.lstat(path)).isDirectory()
  }

  async function fileExists(path) {
    try {
      const file = await fs.open(path, 'r')
      file.close()
      return true
    } catch (err) {
      return false
    }
  }

  async function readFile(path) {
    try {
      const file = await fs.open(path, 'r')
      const read = await file.readFile({ encoding: 'utf-8' })
      file.close()
      return read
    } catch (err) {
      return ''
    }
  }

  async function writeFile(path, data) {
    const file = await fs.open(path, 'w')
    file.writeFile(data)
    file.close()
  }

  async function createDir(path) {
    await fs.mkdir(path, {
      recursive: true,
    })
  }

  async function calculatePaths(source) {
    const filePaths = await fs.readdir(source)
    const outDir = path.join(output, source.replace(path.join(src), ''))
    pathsTree[source] = {
      iconPaths: [],
      indexFilePath: path.join(outDir, 'index.ts'),
      outDir,
    }

    for (let filePath of filePaths) {
      const wholePath = path.join(source, filePath)
      const isDirectory = await isDir(wholePath)
      if (!isDirectory && path.extname(filePath) !== '.svg') continue
      if (isDirectory) {
        if (deep) {
          calculatePaths(wholePath)
        }
      } else {
        const parsed = path.parse(wholePath)
        const name = parsed.name
        const casedName = changeCase[casing](name)
        const out = path.join(output, parsed.dir.replace(path.join(src), ''))
        const outputFilePath = path.join(out, `${casedName}.${ext}`)
        const alreadyExists = await fileExists(outputFilePath)

        pathsTree[source].iconPaths.push({
          sourceFilePath: wholePath,
          outputFilePath,
          alreadyExists,
          name,
        })
      }
    }
  }

  function getPathsTree() {
    return pathsTree
  }

  await calculatePaths(src)

  return { getPathsTree, fileExists, readFile, writeFile, createDir }
}

module.exports = files
