export type Casing =
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

export interface FileSystemProps {
  src: string
  output: string
  deep?: boolean
  ext?: string
  casing?: Casing
}

export interface PathsTree {
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
