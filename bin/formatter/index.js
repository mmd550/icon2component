const prettier = require('prettier')
const logger = require('../logger')
const prettierDefaultConfig = {}

async function formatter({ filePath, options }) {
  const configFilePath = filePath
    ? await prettier.resolveConfigFile(filePath)
    : ''
  const resolvedConfig = configFilePath
    ? require(configFilePath)
    : prettierDefaultConfig

  const formatterErrorMessage = '--icon-cli-formatter-error'

  async function format(source) {
    try {
      const result = await prettier.format(source, {
        ...(resolvedConfig || {}),
        parser: 'babel',
        ...(options || {}),
      })
      return result
    } catch (err) {
      logger.error('error happened when formatting file: ', err)
      throw new Error(formatterErrorMessage)
    }
  }

  return { format, formatterErrorMessage }
}

module.exports = formatter
