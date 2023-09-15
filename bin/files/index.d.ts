interface PathsTree {
  [key: string]: {
    iconPaths: {
      sourceFilePath: string
      outputFilePath: string
      alreadyExists: boolean
      name: string
    }[]
    indexFilePath: string
    outDir: string
  }
}

interface FilesReturnType {
  fileExists: (path: string) => Promise<boolean>
  isDir: (path: string) => Promise<boolean>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, data: string) => Promise<void>
  createDir: (path: string) => Promise<void>
  getPathsTree: () => PathsTree
}

interface Props {
  src: string
  output: string
  deep?: boolean
  ext?: string
  casing?:
    | 'camelCase'
    | 'capitalCase'
    | 'constantCase'
    | 'dotCase'
    | 'headerCase'
    | 'noCase'
    | 'paramCase'
    | 'pascalCase'
    | 'pathCase'
    | 'sentenceCase'
    | 'snakeCase'
}

declare function files(props?: Props): Promise<FilesReturnType>

export = files
