type Optimize = (svgString: string) => Promise<string>

interface Config {
  keepColors?: boolean
}

interface ReturnType {
  optimize: Optimize
}

declare function optimizer(
  /** The string to obscure */
  config?: Config,
): ReturnType

export = optimizer
