const matchHtmlRegExp = /["'&<>]/

export default function escape(source: string): string {
  const str = String(source)
  const match = matchHtmlRegExp.exec(str)

  if (!match) {
    return str
  }

  let charRef: string
  let html = ''
  let index
  let lastIndex = 0

  for (index = match.index; index < str.length; ++index) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        charRef = '&quot;'

        break
      case 38: // &
        charRef = '&amp;'

        break
      case 39: // '
        charRef = '&#39;'

        break
      case 60: // <
        charRef = '&lt;'

        break
      case 62: // >
        charRef = '&gt;'

        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    html += charRef
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html
}
