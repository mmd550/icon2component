import * as prettier from "prettier";
import logger from "../logger";
const prettierDefaultConfig = {};

interface Props {
  filePath: string;
  options?: {
    parser?:
      | "babel"
      | "babel-flow"
      | "babel-ts"
      | "flow"
      | "typescript"
      | "espree"
      | "meriyah"
      | "acorn"
      | "css"
      | "scss"
      | "less"
      | "json"
      | "json5"
      | "json-stringify"
      | "graphql"
      | "markdown"
      | "mdx"
      | "html"
      | "vue"
      | "angular"
      | "lwc"
      | "yaml";
    printWidth?: number;
    tabWidth?: number;
    useTabs?: boolean;
    semi?: boolean;
    singleQuote?: boolean;
    bracketSameLine?: boolean;
    bracketSpacing?: boolean;
    arrowParens?: "always" | "avoid";
    rangeStart?: number;
    rangeEnd?: number;
    endOfLine?: "lf" | "crlf" | "cr" | "auto";
    singleAttributePerLine?: boolean;
  };
}

async function formatter({ filePath, options }: Props) {
  const configFilePath = filePath
    ? await prettier.resolveConfigFile(filePath)
    : "";
  const resolvedConfig = configFilePath
    ? require(configFilePath)
    : prettierDefaultConfig;

  const formatterErrorMessage = "--icon-cli-formatter-error";

  async function format(source: string) {
    try {
      const result = await prettier.format(source, {
        ...(resolvedConfig || {}),
        parser: "babel",
        ...(options || {}),
      });
      return result;
    } catch (err) {
      logger.error("error happened when formatting file: ", err);
      throw new Error(formatterErrorMessage);
    }
  }

  return { format, formatterErrorMessage };
}

export default formatter;
