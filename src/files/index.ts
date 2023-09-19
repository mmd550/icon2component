import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as changeCase from 'change-case'
import { PathsTree, FileSystemProps, Casing } from './interfaces'

class FileSystem {
  private pathsTree: PathsTree
  private src: string
  private output: string
  private deep: boolean
  private ext: string
  private casing: Casing

  constructor({
    src,
    output,
    deep = false,
    ext = 'tsx',
    casing = 'paramCase',
  }: FileSystemProps) {
    this.src = src
    this.output = output
    this.deep = deep
    this.ext = ext
    this.casing = casing
  }

  async isDir(path: string) {
    return (await fs.lstat(path)).isDirectory()
  }

  async fileExists(path: string) {
    try {
      const file = await fs.open(path, 'r')
      file.close()
      return true
    } catch (err) {
      return false
    }
  }

  async createDir(path: string) {
    await fs.mkdir(path, {
      recursive: true,
    })
  }

  async readFile(path: string) {
    try {
      const file = await fs.open(path, 'r')
      const read = await file.readFile({ encoding: 'utf-8' })
      file.close()
      return read
    } catch (err) {
      return ''
    }
  }

  async writeFile(path: string, data: string) {
    const file = await fs.open(path, 'w')
    file.writeFile(data)
    file.close()
  }

  private async calculatePaths(source: string) {
    const filePaths = await fs.readdir(source)
    const outDir = path.join(
      this.output,
      source.replace(path.join(this.src), ''),
    )

    this.pathsTree[source] = {
      iconPaths: [],
      indexFilePath: path.join(outDir, 'index.ts'),
      outDir,
    }

    for (let filePath of filePaths) {
      const wholePath = path.join(source, filePath)
      const isDirectory = await this.isDir(wholePath)
      if (!isDirectory && path.extname(filePath) !== '.svg') continue
      if (isDirectory) {
        if (this.deep) {
          await this.calculatePaths(wholePath)
        }
      } else {
        const parsed = path.parse(wholePath)
        const name = parsed.name
        const casedName = changeCase[this.casing](name)
        const out = path.join(
          this.output,
          parsed.dir.replace(path.join(this.src), ''),
        )
        const outputFilePath = path.join(out, `${casedName}.${this.ext}`)
        const alreadyExists = await this.fileExists(outputFilePath)

        this.pathsTree[source].iconPaths.push({
          sourceFilePath: wholePath,
          outputFilePath,
          alreadyExists,
          name,
        })
      }
    }
  }

  async getPathsTree() {
    if (this.pathsTree) {
      return this.pathsTree
    } else {
      this.pathsTree = {}
      await this.calculatePaths(this.src)
      return this.pathsTree
    }
  }
}

export default FileSystem
