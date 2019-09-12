import isString from 'lodash/isString'
import { loader } from 'webpack'
import LoaderContext = loader.LoaderContext
import loaderUtils from 'loader-utils'
import querystring, { ParsedUrlQuery } from 'querystring'
import { getOptions, SFCLoaderPluginOptions } from './SFCLoaderPlugin'

const isDedupLoader = (loader: any): boolean => __filename === loader.path
const isNullLoader = (loader: any): boolean =>
  /[/\\@]null-loader/.test(loader.path)
const isCSSLoader = (loader: any): boolean =>
  /[/\\@]css-loader/.test(loader.path)
const isCacheLoader = (loader: any): boolean =>
  /[/\\@]cache-loader/.test(loader.path)
const sfcLoaderPath = require.resolve('./index')
const isSFCLoader = (loader: any): boolean => loader.path === sfcLoaderPath
const shouldIgnoreCustomBlock = (loaders: any[]) => {
  const actualLoaders: any[] = loaders.filter((loader) => {
    return (
      !isDedupLoader(loader) && !isSFCLoader(loader) && !isCacheLoader(loader)
    )
  })

  return 0 === actualLoaders.length
}
const scopedCSSLoaderPath = require.resolve('@rosemlab/scoped-css-loader')
const stringifyRequest = loaderUtils.stringifyRequest

export default function(source: string): string {
  return source
}

export function pitch(
  this: LoaderContext,
  remainingRequest: any,
  precedingRequest: any,
  data: any
): string | void {
  // do not inject if user uses null-loader to void the type
  if (this.loaders.some(isNullLoader)) {
    return
  }

  // if a custom block has no other matching loader other than sfc-loader itself
  // or cache-loader, we should ignore it
  if (shouldIgnoreCustomBlock(this.loaders)) {
    return ''
  }

  // `.slice(1)` - remove "?" character
  const query: ParsedUrlQuery = querystring.parse(this.resourceQuery.slice(1))
  const pluginOptions: SFCLoaderPluginOptions = getOptions(this)
  // todo cache
  const { cacheDirectory, cacheIdentifier } = pluginOptions

  // When the user defines a rule that has only resourceQuery but no test,
  // both that rule and the cloned rule will match, resulting in duplicated
  // loaders. Therefore it is necessary to perform a dedupe here.
  // Also make sure to dedupe based on loader path and query to be safe.
  // Assumes you'd probably never want to apply the same loader on the same
  // file twice.
  const loaders: any[] = this.loaders
  const seen: { [identifier: string]: boolean } = {}
  const loaderStrings: string[] = []

  // Inject scoped-css-loader before css-loader for scoped CSS and trimming
  if ('style' === query.block) {
    const cssLoaderIndex: number = loaders.findIndex(isCSSLoader)

    if (cssLoaderIndex > -1) {
      loaders.splice(cssLoaderIndex + 1, 0, scopedCSSLoaderPath)
    }
  }

  loaders.forEach((loader: any) => {
    if (isDedupLoader(loader)) {
      return
    }

    const [identifier, request] = isString(loader)
      ? [loader, loader]
      : [loader.path + loader.query, loader.request]

    if (!seen[identifier]) {
      seen[identifier] = true
      // loader.request contains both the resolved loader path and its options
      // query (e.g. ??ref-0)
      loaderStrings.push(request)
    }
  })

  const request: string = stringifyRequest(
    this,
    '-!' + [...loaderStrings, this.resourcePath + this.resourceQuery].join('!')
  )

  return (
    `import m from ${request};\n` +
    `export default m;\n` +
    `export * from ${request};\n`
  )
}
