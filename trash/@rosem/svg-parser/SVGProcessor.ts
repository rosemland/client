import XMLProcessor from '@rosemlabs/xml-parser/XMLProcessor'

export default interface SVGProcessor extends XMLProcessor {
  isForeignElement(tagName: string): boolean
}
