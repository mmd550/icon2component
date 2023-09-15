interface FormatterReturnType {
  format: (source: string) => Promise<string>
  formatterErrorMessage: string
}

interface Props {
  filePath: string
  options: {
    parser?:
      | 'babel'
      | 'babel-flow'
      | 'babel-ts'
      | 'flow'
      | 'typescript'
      | 'espree'
      | 'meriyah'
      | 'acorn'
      | 'css'
      | 'scss'
      | 'less'
      | 'json'
      | 'json5'
      | 'json-stringify'
      | 'graphql'
      | 'markdown'
      | 'mdx'
      | 'html'
      | 'vue'
      | 'angular'
      | 'lwc'
      | 'yaml'
    printWidth?: number
    tabWidth?: number
    useTabs?: boolean
    semi?: boolean
    singleQuote?: boolean
    bracketSameLine?: boolean
    bracketSpacing?: boolean
    arrowParens?: 'always' | 'avoid'
    rangeStart?: number
    rangeEnd?: number
    endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto'
    singleAttributePerLine?: boolean
  }
}

declare function formatter(props?: Props): Promise<FormatterReturnType>

export = formatter
