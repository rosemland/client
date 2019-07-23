const linkElementAttrRegExpPart = `re(?:ferrerpolicy|l)|href`
const hyperlinkElementAttrRegExpPart = `download|${linkElementAttrRegExpPart}`
const mediaElementAttrRegExpPart = `autoplay|controls|crossorigin|loop|muted|preload|src`
const tableCellElementAttrRegExpPart = `(?:col|row)span|headers`
const optionElementAttrRegExpPart = `disabled|label`
const interactiveElementAttrRegExp = /^(open)$/i
const quoteElementAttrRegExp = /^(cite)$/i
const editElementAttrRegExp = /^(cite|datetime)$/i
const boundedElementAttrRegExpPart = `height|width`
const referElementAttrRegExpPart = `referrerpolicy|src`
const crossReferElementAttrRegExpPart = `crossorigin|integrity|type`
const colElementAttrRegExp = /^(span)$/i
const inputElementAutoAttrRegExpPart = `auto(?:complete|focus)`
const formAssociatedElementRegExpPart = `name|disabled|form`
const formAssociatedElementExtendedRegExpPart = `${formAssociatedElementRegExpPart}(?:action|enctype|method|novalidate|target)?|type|value`
const textInputElementAttrRegExpPart = `dirname|placeholder|readonly`
const multipleInputElementAttrRegExpPart = `required|(?:multipl|siz)e`

function RE(pattern: string): RegExp {
  return new RegExp(`^(${pattern})$`, 'i')
}

export type HTMLElementAttrMap = {
  [tagName in keyof HTMLElementTagNameMap]?: RegExp
}

// Global attributes (HTML Standard)
// https://html.spec.whatwg.org/#global-attributes
// accesskey, autocapitalize, contenteditable, dir, draggable, enterkeyhint,
// hidden, inputmode, is, itemid, itemprop, itemref, itemscope, itemtype, lang,
// nonce, spellcheck, style, tabindex, title, translate
// Global attributes (DOM Standard)
// class, id, slot
export const globalHTMLElementAttrRegExp: RegExp = /^(a(?:ccesskey|utocapitalize)|c(?:lass|ontenteditable)|d(?:ir|raggable)|enterkeyhint|hidden|i(?:[ds]|nputmode|tem(?:id|prop|ref|scope|type))|lang|nonce|s(?:lot|pellcheck|tyle)|t(?:abindex|itle|ranslate))$/

export const htmlElementAttrMap: HTMLElementAttrMap = {
  // The document element
  // Ignore <html>

  // Document metadata
  // Ignore <head>, <title>
  // href, target
  base: /^(href|target)$/i,
  // as, color, crossorigin, href, hreflang, imagesizes, imagesrcset, integrity,
  // media, referrerpolicy, rel, sizes, type
  link: RE(
    `as|color|${crossReferElementAttrRegExpPart}|${linkElementAttrRegExpPart}(?:lang)?|image(?:sizes|srcset)|media|sizes`
  ),
  // charset, content, http-equiv, name
  meta: /^(c(?:harset|ontent)|http-equiv|name)$/i,
  // media
  style: /^(media)$/i,

  // Sections
  // Ignore <body>, <article>, <section>, <nav>, <aside>, <h1>, <h2>, <h3>,
  // <h4>, <h5>, <h6>, <hgroup>, <header>, <footer>, <address>

  // Grouping content
  // Ignore <p>, <hr>, <pre>
  // cite
  blockquote: quoteElementAttrRegExp,
  // reversed (boolean), start (long), type
  ol: /^(reversed|start|type)$/i,
  // Ignore <ul>, <menu>
  // value (long) - if a child of <ol>
  li: /^(value)$/i,
  // Ignore <dl>, <dd>, <dt>, <figure>, <figcaption>, <main>, <div>

  // Text-level semantics
  // Uses mixin HTMLHyperlinkElementUtils
  // download, href, hreflang, ping, referrerpolicy, rel, target, type
  a: RE(`${hyperlinkElementAttrRegExpPart}(?:lang)?|ping|t(?:arget|ype)`),
  // Ignore <em>, <strong>, <small>, <s>, <cite>
  // cite
  q: quoteElementAttrRegExp,
  // Ignore <dfn>, <abbr>, <ruby>, <rt>, <rp>
  // value
  data: /^(value)$/i,
  // datetime
  time: /^(datetime)$/i,
  // Ignore <code>, <var>, <samp>, <kbd>, <sub>, <sup>, <i>, <b>, <u>, <mark>,
  // <bdi>, <bdo>, <span>, <br>, <wbr>

  // Edits
  // cite, datetime
  ins: editElementAttrRegExp,
  // cite, datetime
  del: editElementAttrRegExp,

  // Embedded content
  // Ignore <picture>
  // media, sizes, src, srcset, type
  source: /^(media|s(?:izes|rc(?:set)?)|type)$/i,
  // alt, crossorigin, decoding, height (ulong), ismap (boolean),
  // referrerpolicy, sizes, src, srcset, usemap, width (ulong)
  img: RE(
    `alt|crossorigin|decoding|${boundedElementAttrRegExpPart}|(?:is|use)map|${referElementAttrRegExpPart}(?:set)?|sizes`
  ),
  // allow, allowfullscreen (boolean), allowpaymentrequest (boolean), height,
  // name, referrerpolicy, src, srcdoc, sandbox, width
  iframe: RE(
    `allow(?:fullscreen|paymentrequest)?|${boundedElementAttrRegExpPart}|name|${referElementAttrRegExpPart}(?:doc)?|sandbox`
  ),
  // height, src, type, width
  embed: RE(`${boundedElementAttrRegExpPart}|src|type`),
  // data, form, height, name, type, usemap, width
  object: RE(`data|form|${boundedElementAttrRegExpPart}|name|type|usemap`),
  // name, value
  param: /^(name|value)$/i,
  // Extends HTMLMediaElement
  // autoplay, controls, crossorigin, height, loop, muted,
  // playsinline (boolean), poster, preload, src, width
  video: RE(
    `${mediaElementAttrRegExpPart}|${boundedElementAttrRegExpPart}|p(?:laysinline|oster)`
  ),
  // Extends HTMLMediaElement
  // autoplay, controls, crossorigin, loop, muted, preload, src
  audio: RE(mediaElementAttrRegExpPart),
  // default (boolean), kind, label, src, srclang
  track: /^(default|kind|label|src(?:lang)?)$/i,
  map: /^(name)$/i,
  // Uses mixin HTMLHyperlinkElementUtils
  // alt, coords, download, href, name, ping, referrerpolicy, rel, shape, target
  area: RE(
    `alt|coords|${hyperlinkElementAttrRegExpPart}|name|ping|shape|target`
  ),

  // Tabular data
  // Ignore <table>, <caption>
  // span (number)
  colgroup: colElementAttrRegExp,
  // span (number)
  col: colElementAttrRegExp,
  // Ignore <tbody>, <thead>, <tfoot>, <tr>
  // colspan (number), headers, rowspan (number)
  td: RE(tableCellElementAttrRegExpPart),
  // abbr, colspan (number), headers, rowspan (number), scope
  th: RE(`abbr|${tableCellElementAttrRegExpPart}|scope`),

  // Forms
  // accept-charset, action, autocomplete, enctype, method, name,
  // novalidate (boolean), rel, target
  form: /^(a(?:c(?:cept-charset|tion)utocomplete)|enctype|method|n(?:ame|ovalidate)|rel|target)$/i,
  // for
  label: /^(for)$/i,
  // accept, alt, autocomplete, autofocus (boolean), checked (boolean), dirname,
  // disabled (boolean), form, formaction, formenctype, formmethod,
  // formnovalidate (boolean), formtarget, height (number), list, max,
  // maxlength (number), min, minlength (number), multiple (boolean), name,
  // pattern, placeholder, readonly (boolean), required (boolean),
  // size (number), src, step, type, value, width
  input: RE(
    `a(?:ccep|l)t|${inputElementAutoAttrRegExpPart}|checked|${textInputElementAttrRegExpPart}|${formAssociatedElementExtendedRegExpPart}|${boundedElementAttrRegExpPart}|list|m(?:ax|in)(?:length)?|${multipleInputElementAttrRegExpPart}|pattern|s(?:rc|tep)`
  ),
  // autofocus (boolean), disabled (boolean), form, formaction, formenctype,
  // formmethod, formnovalidate (boolean), formtarget, name, type, value
  button: RE(`autofocus|${formAssociatedElementExtendedRegExpPart}`),
  // autocomplete, autofocus (boolean), disabled (boolean), form,
  // multiple (boolean), name, required (boolean), size (number)
  select: RE(
    `${inputElementAutoAttrRegExpPart}|${formAssociatedElementRegExpPart}|${multipleInputElementAttrRegExpPart}`
  ),
  // Ignore <datalist>
  // disabled (boolean), label
  optgroup: RE(optionElementAttrRegExpPart),
  // disabled, label, selected, value
  option: RE(`${optionElementAttrRegExpPart}|selected|value`),
  // autocomplete, autofocus (boolean), cols (number), dirname,
  // disabled (boolean), form, maxlength (number), minlength (number), name,
  // placeholder, readonly (boolean), required (boolean), rows (number), wrap
  textarea: RE(
    `${inputElementAutoAttrRegExpPart}|(?:col|row)s|${textInputElementAttrRegExpPart}|${formAssociatedElementRegExpPart}|m(?:ax|in)length|required|wrap`
  ),
  // for, form, name
  output: /^(form?|name)$/i,
  // max (double), value (double)
  progress: /^(max|value)$/i,
  // high (double), low (double), min (double), max (double), optimum (double),
  // value (double)
  meter: /^(high|low|m(?:in|ax)|optimum|value)$/i,
  // disabled (boolean), form, name
  fieldset: RE(formAssociatedElementRegExpPart),
  // Ignore <legend>

  // Interactive elements
  // open (boolean)
  details: interactiveElementAttrRegExp,
  // Ignore <summary>
  // open (boolean)
  dialog: interactiveElementAttrRegExp,

  // Scripting
  // async (boolean), crossorigin, defer (boolean), integrity,
  // nomodule (boolean), referrerpolicy, src, type
  script: RE(
    `async|${crossReferElementAttrRegExpPart}|defer|nomodule|${referElementAttrRegExpPart}`
  ),
  // Ignore <noscript>, <template>
  // name
  slot: /^(name)$/i,
  // height (ulong), width (ulong)
  canvas: RE(boundedElementAttrRegExpPart),
}

export default htmlElementAttrMap

export function isValidHTMLElementAttr(
  attrName: string,
  tagName?: keyof HTMLElementTagNameMap
): boolean {
  return tagName
    ? tagName in htmlElementAttrMap &&
        (htmlElementAttrMap[tagName]!.test(attrName) ||
          globalHTMLElementAttrRegExp.test(attrName))
    : globalHTMLElementAttrRegExp.test(attrName)
}
