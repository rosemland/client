import { StartTag } from '@rosemlab/xml-parser/nodes'
import { RawSourceMap } from 'source-map'

// name, lang, index, src, meta, content
export default interface SFCBlock extends StartTag {
  map?: RawSourceMap
  output: any
  // type?: string // instead of lang
  // src?: string
  // global?: boolean // instead of "scoped", should be scoped by default
  // module?: string | boolean
}
