import { StartTag, Content } from '@rosem/xml-parser/nodes'
import { RawSourceMap } from 'source-map'

// name, lang, index, src, meta, content
export default interface SFCBlock extends StartTag, Content {
  map?: RawSourceMap
  // type?: string // instead of lang
  // src?: string
  // global?: boolean // instead of "scoped", should be scoped by default
  // module?: string | boolean
}