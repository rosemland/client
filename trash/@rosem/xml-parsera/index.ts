// export { default, XMLParserOptions } from './XMLParser'
// export { default as HookList } from './HookList'
// export { default as BlankModule } from './BlankModule'
// export { default as XMLProcessor, XMLProcessorMap } from './XMLProcessor'
export {
  encodeBaseEntities,
  decodeBaseEntities,
  BASE_ENTITY_DECODING_MAP,
} from './baseEntities'

export type NamespaceMap = {
  [namespacePrefix: string]: string
}

export type TypeMap = {
  [type: string]: string
}
