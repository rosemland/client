import forEach from 'lodash/forEach'
import { loader } from 'webpack'
import LoaderContext = loader.LoaderContext
import { stringifyRequest } from 'loader-utils'
import qs from 'querystring'
import SFCBlock from '../SFCBlock'
import SFCDescriptor from '../SFCDescriptor'
import attrsToQuery from './attrsToQuery'
import { getOptions, SFCLoaderPluginOptions } from '../SFCLoaderPlugin'

const jsonStringify = JSON.stringify
const stringify = (value: any, ignoreRootKeyList: string[] = []): string => {
  let cache: any[] = []

  const string: string = jsonStringify(
    value,
    function(key: string, innerValue: any) {
      // Ignore some unnecessary properties to reduce size of generated code
      if (ignoreRootKeyList.includes(key) && innerValue === value[key]) {
        return
      }

      if (typeof innerValue === 'object' && innerValue !== null) {
        if (cache.indexOf(innerValue) !== -1) {
          // Circular reference found, discard key
          return
        }
        // Store value in our collection
        cache.push(innerValue)
      }

      return innerValue
    },
    2
  )

  // Enable garbage collection
  cache.length = 0

  if (string) {
    return string.replace(/\n/g, '\n    ')
  }

  return string
}

const DEFAULT_EXPORT_VARIABLE_NAME: string = 'sfc'
// these are built-in query parameters so should be ignored if the user happen
// to add them as attrs
// `src` and `lang` will be added as internal attributes
const ignoredAttrs = ['block', 'index', 'lang', 'src', 'issuerPath']

export default function generateBlocksCode(
  loaderContext: LoaderContext,
  descriptor: SFCDescriptor,
  exportName: string = 'default'
): string {
  const pluginOptions: SFCLoaderPluginOptions = getOptions(loaderContext)

  if (!pluginOptions) {
    throw new Error('[sfc-loader Error] SFCLoaderPlugin is required')
  }

  let isDefault: boolean = false

  if ('default' === exportName) {
    isDefault = true
    exportName = DEFAULT_EXPORT_VARIABLE_NAME
  }

  let importCode = ''
  let descriptorCode = ''
  let outputCode = ''

  forEach(descriptor, (blocks: SFCBlock[], name: string): void => {
    descriptorCode += `\n  "${name}": [`
    importCode +=
      `/* ${name} blocks */\n` +
      blocks
        .map((block: SFCBlock, index: number) => {
          const attrMap = { ...block.attrMap! }
          const internalAttrMap: { [name: string]: string } = {
            block: qs.escape(name),
          }
          let src: string = loaderContext.resourcePath

          internalAttrMap.index = String(index)

          // No need `lang` attribute if we have external resource
          if (attrMap.src) {
            src = String(attrMap.src)
            internalAttrMap.issuerPath = qs.escape(loaderContext.resourcePath)
          } else {
            const lang: string | number | boolean =
              attrMap.lang || pluginOptions.blockLangMap[name]

            if (null != lang) {
              internalAttrMap.lang = String(lang)
            }
          }

          // Ignore user attributes which are built-in
          delete attrMap[pluginOptions.fileExtension]
          ignoredAttrs.forEach((attrName: string): void => {
            delete attrMap[attrName]
          })

          const internalAttrsQuery: string = attrsToQuery(internalAttrMap)
          const attrsQuery: string = attrsToQuery(attrMap)
          const inheritQuery: string = loaderContext.resourceQuery
            ? `&${loaderContext.resourceQuery.slice(1)}`
            : ''
          const query: string = `?${pluginOptions.fileExtension}${internalAttrsQuery}${attrsQuery}${inheritQuery}`
          const blockName: string = `${name}${index}`

          descriptorCode += `\n    ${stringify(block, ['content', 'map'])},`
          outputCode += `\n${exportName}[${jsonStringify(
            name
          )}][${jsonStringify(index)}].output = ${blockName}`

          return `import ${blockName} from ${stringifyRequest(
            loaderContext,
            src + query
          )}`
          // + `\nif (typeof block{i} === 'function') block{i}(component)`
        })
        .join(`\n`) +
      '\n'
    descriptorCode += '\n  ],'
  })

  return `${importCode}\nconst ${exportName} = {${descriptorCode}\n}\n${outputCode}\n\nexport ${
    isDefault ? `default` : ''
  } ${exportName}\n`
}
