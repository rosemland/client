const apply = Reflect.apply

export type Range = {
  start: number
  end: number
}

export type SourceCodeRange = {
  __starts: number
  __ends: number
}

export type SourceCodePosition = Partial<{
  __line: Range
  __column: Range
}>

export type SourceCodeLocation = SourceCodeRange & SourceCodePosition

export type Token = {
  __starts: number
  __ends: number
}

export interface TokenIdentifier {
  test(source: string): boolean
  // exec(source: string): string[] | null
}

// export interface TokenAnalyzer<T extends Node> {
//   analyze(tokenChunks: string[], state: State): T | void
// }

export interface TokenParser<
  T extends Token,
  U extends TokenHooks /*, V extends U = U*/
> extends TokenIdentifier {
  parse(source: string, tokenizer: Tokenizer<U>): T | void
}

export type StartHook = (source: string) => any

export type EndHook = () => any

export type WarningHook = <T extends SourceCodeLocation = SourceCodeLocation>(
  message: string,
  location: T
) => any

export type TokenHook<T extends Token> = <U extends T>(
  token: U,
  ...args: any[]
) => any

// export type TokenHooks = {[tokenHookName: string]: TokenHook<Token>}
export type TokenHooks = Partial<Record<string, TokenHook<Token>>>

export type TokenizerHooks = Partial<{
  start: StartHook
  end: EndHook
  warn: WarningHook
}>

export type WithWarningHook<T extends TokenHooks> = T &
  Pick<TokenizerHooks, 'warn'>

export type Plugin<T extends TokenHooks> = TokenizerHooks & T
// export type Plugin<HookName extends string> = TokenizerHooks & Record<HookName, TokenHook<Token>>
// export type Plugin = TokenizerHooks

export default class Tokenizer<T extends TokenHooks> implements TokenizerHooks {
  protected readonly tokenParsers: TokenParser<Token, T>[]
  protected readonly plugins: Plugin<T>[] = []
  source: string
  remainingSource: string
  cursorPosition: number = 0
  tokenParserIndex: number = -1
  currentToken?: Token
  // // Used for raw text
  // raw?: boolean
  // // Used for conditional comment
  // conditional?: boolean

  constructor(
    tokenParsers: TokenParser<Token, T>[] = [],
    plugins: Plugin<T>[] = [],
    source = ''
  ) {
    this.tokenParsers = tokenParsers
    this.plugins = plugins
    this.source = this.remainingSource = source
  }

  reset(): void {
    this.source = this.remainingSource = ''
    this.cursorPosition = 0
    this.tokenParserIndex = -1
    this.currentToken = undefined
  }

  get eof() {
    return this.remainingSource === ''
  }

  advance(n: number): number {
    this.remainingSource = this.remainingSource.slice(n)

    return (this.cursorPosition += n)
  }

  *token(): Generator<Token> {
    for (
      this.tokenParserIndex = 0;
      this.tokenParserIndex < this.tokenParsers.length;
      ++this.tokenParserIndex
    ) {
      this.tokenParsers[this.tokenParserIndex].parse(this.remainingSource, this)

      if (this.currentToken) {
        yield this.currentToken

        this.currentToken = undefined
      } else if (this.eof) {
        return
      }
    }

    yield* this.token()
  }

  replaceToken(token: Token): void {
    this.currentToken = token
  }

  skipToken(): void {
    this.tokenParserIndex = -1
    this.currentToken = undefined
  }

  start(source: string): void {
    this.source = this.remainingSource = source

    for (const plugin of this.plugins) {
      // Some plugins can skip start hook
      if (!plugin.start) {
        continue
      }

      plugin.start(source)
    }
  }

  end(): void {
    for (const plugin of this.plugins) {
      // Some plugins can skip end hook
      if (!plugin.end) {
        continue
      }

      plugin.end()
    }
  }

  warn(message: string, sourceCodeLocation: SourceCodeLocation): void {
    for (const plugin of this.plugins) {
      // Some plugins can skip warn hook
      if (!plugin.warn) {
        continue
      }

      plugin.warn(message, sourceCodeLocation)
    }
  }

  emit<HookName extends keyof T>(
    hook: HookName,
    ...args: Required<T>[HookName] extends (...args: any) => any
      ? Parameters<Required<T>[HookName]>
      : never
  ): void {
    this.currentToken = args[0]

    for (const plugin of this.plugins) {
      // Some plugins can skip some hooks
      if (!plugin[hook]) {
        continue
      }

      // Some plugins can skip the current token
      if (!this.currentToken) {
        break
      }

      apply(plugin[hook]!, plugin, args)
    }
  }
}