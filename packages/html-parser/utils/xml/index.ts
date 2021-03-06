function regExp(string: string, flags?: string): RegExp {
  return new RegExp(string, flags)
}

export const anyCharCapturePart = '([\\s\\S]*?)'

export const processingInstructionStartRegExp = /<\?/

export const processingInstructionEndRegExp = /\?>/

export const processingInstructionRegExp = regExp(
  `${processingInstructionStartRegExp.source}${anyCharCapturePart}${processingInstructionEndRegExp}`,
  'i'
)

export const declarationStartRegExp = /^<!/

export const declarationRegExp = regExp(
  `${declarationStartRegExp.source}([^>]*)>`,
  'i'
)

/**
 * Unicode characters used for parsing html tags, component names and property
 * paths. Using
 * https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF (emoji) due to it freezing up PhantomJS
 *
 * avoid compression of unicode sequences by using regexp instead of string
 */
export const potentialCustomElementNameCharRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/ //\u10000-\uEFFFF/

// Non-colonized name e.g. "name"
// (https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName)
// Could use CombiningChar and Extender characters
// but for ui templates we can enforce a simple charset
const ncNameRegExpPart = `[_${potentialCustomElementNameCharRegExp.source}]?[${potentialCustomElementNameCharRegExp.source}][0-9\\-_\\.${potentialCustomElementNameCharRegExp.source}]*`

// Qualified name e.g. "namespace:name"
export const qualifiedNameRegExp = regExp(
  `^(?:(${ncNameRegExpPart}):)?(${ncNameRegExpPart})$`
)

const qualifiedNameRegExpCapturePart = `((?:(${ncNameRegExpPart}):)?(${ncNameRegExpPart}))`

export const startTagOpenRegExp = regExp(`<${qualifiedNameRegExpCapturePart}`)

// Regular expression for parsing attributes
export const attributeRegExp = /^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

export const startTagCloseRegExp = /\s*(\/?)>/

export const endTagRegExp = regExp(
  `<\\/(?:${qualifiedNameRegExpCapturePart})?[^>]*>`
)

// Used {2} to avoid being passed as HTML comment when inlined in a page
export const commentStartRegExp = /<!-{2}/

export const commentEndRegExp = /-{2}>/

export const commentRegExp = regExp(
  `${commentStartRegExp.source}${anyCharCapturePart}${commentEndRegExp}`
)

export const cDataSectionStartRegExp = /<!\[CDATA\[/

export const cDataSectionEndRegExp = /]{2}>/

export const cDataSectionRegExp = regExp(
  `${cDataSectionStartRegExp.source}${anyCharCapturePart}${cDataSectionEndRegExp.source}`
)

//todo remove
export const startsWithStartTagOpenRegExp = regExp(
  `^<${qualifiedNameRegExpCapturePart}`
)
// todo remove
export const startsWithStartTagCloseRegExp = /^\s*(\/?)>/

// todo remove
export const startsWithEndTagRegExp = regExp(
  `^<\\/(?:${qualifiedNameRegExpCapturePart})?[^>]*>`
)
