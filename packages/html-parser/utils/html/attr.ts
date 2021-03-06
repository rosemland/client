//todo https://npm.runkit.com/regexgen
//https://dev.w3.org/html5/html-author/

import { isNaN } from 'lodash'
import { LiteralUnion } from 'type-fest'
import { isWaiAriaAttribute } from '../wai-aria'
import { regExpExactI as r } from '../../utils'

const linkElementAttrRegExpPart = `referrerpolicy|rel|href`
const hyperlinkElementAttrRegExpPart = `download|${linkElementAttrRegExpPart}`
const mediaElementAttrRegExpPart = `autoplay|controls|crossorigin|loop|muted|preload|src`
const tableCellElementAttrRegExpPart = `(?:col|row)span|headers`
const optionElementAttrRegExpPart = `disabled|label`
const interactiveElementAttrRegExp = r('open')
const quoteElementAttrRegExp = r('cite')
const editElementAttrRegExp = r('cite|datetime')
const boundedElementAttrRegExpPart = `height|width`
const referElementAttrRegExpPart = `referrerpolicy|src`
const crossReferElementAttrRegExpPart = `crossorigin|integrity|type`
const colElementAttrRegExp = r('span')
const formAssociatedElementAttrRegExpPart = `name|disabled|form`
const formAssociatedAutoElementAttrRegExpPart = `auto(?:complete|focus)`
const buttonElementAttrRegExpPart = `${formAssociatedElementAttrRegExpPart}(?:action|enctype|method|novalidate|target)?|type|value`
const textInputElementAttrRegExpPart = `dirname|placeholder|readonly`
const multipleInputElementAttrRegExpPart = `required|multiple|size`

// Custom data attributes
export const customDataAttributeRegExp = /^data-/i

export const isCustomDataAttribute = (name: string): boolean =>
  customDataAttributeRegExp.test(name)

// Exceptions
// https://html.spec.whatwg.org/multipage/introduction.html#restrictions-on-content-models-and-on-attribute-values
export const reservedAttributeRegExp = /^x-|^[^_]*_[^_]*$/i

export const isReservedAttribute = (name: string): boolean =>
  reservedAttributeRegExp.test(name)

// Global attributes (HTML Standard)
// https://html.spec.whatwg.org/#global-attributes
// accesskey, autocapitalize, contenteditable, dir, draggable, enterkeyhint,
// hidden, inputmode, is, itemid, itemprop, itemref, itemscope, itemtype, lang,
// nonce, spellcheck, style, tabindex, title, translate, data-*
// Global attributes (DOM Standard)
// class, id, slot
// Global attributes (ARIA Standard)
// role, aria-*
export const htmlElementCommonAttributeRegExp = r(
  'accesskey|autocapitalize|class|contenteditable|dir|draggable|enterkeyhint|hidden|i[ds]|inputmode|item(?:id|prop|ref|scope|type)|lang|nonce|role|slot|spellcheck|style|tabindex|title|translate'
)

export const isHTMLElementCommonAttribute = (name: string): boolean =>
  htmlElementCommonAttributeRegExp.test(name)

export function isHTMLElementGlobalAttribute(attrName: string): boolean {
  return (
    isHTMLElementCommonAttribute(attrName) ||
    isCustomDataAttribute(attrName) ||
    isWaiAriaAttribute(attrName)
  )
}

export type HTMLElementAttrMap = {
  [tagName in keyof HTMLElementTagNameMap]?: RegExp | string[]
}

export type HTMLElementAttrRegExpMap = {
  [tagName in keyof HTMLElementTagNameMap]?: RegExp
}

export const htmlElementLocalAttributeMap: HTMLElementAttrRegExpMap = {
  // The document element
  // Ignore <html>

  // Document metadata
  // Ignore <head>, <title>
  // href, target
  base: /^href|target$/i,
  // as, color, crossorigin, href, hreflang, imagesizes, imagesrcset, integrity,
  // media, referrerpolicy, rel, sizes, type
  link: r(
    `as|color|${crossReferElementAttrRegExpPart}|${linkElementAttrRegExpPart}(?:lang)?|image(?:sizes|srcset)|media|sizes`
  ),
  // charset, content, http-equiv, name
  meta: /^charset|content|http-equiv|name$/i,
  // media
  style: /^media$/i,

  // Sections
  // Ignore <body>, <article>, <section>, <nav>, <aside>, <h1>, <h2>, <h3>,
  // <h4>, <h5>, <h6>, <hgroup>, <header>, <footer>, <address>

  // Grouping content
  // Ignore <p>, <hr>, <pre>
  // cite
  blockquote: quoteElementAttrRegExp,
  // reversed (boolean), start (long), type
  ol: /^reversed|start|type$/i,
  // Ignore <ul>, <menu>
  // value (long) - if a child of an <ol> element
  li: /^value$/i,
  // Ignore <dl>, <dd>, <dt>, <figure>, <figcaption>, <main>, <div>

  // Text-level semantics
  // Uses mixin HTMLHyperlinkElementUtils
  // download, href, hreflang, ping, referrerpolicy, rel, target, type
  a: r(
    `${hyperlinkElementAttrRegExpPart}(?:lang)?|ping|target|type`
  ),
  // Ignore <em>, <strong>, <small>, <s>, <cite>
  // cite
  q: quoteElementAttrRegExp,
  // Ignore <dfn>, <abbr>, <ruby>, <rt>, <rp>
  // value
  data: /^value$/i,
  // datetime
  time: /^datetime$/i,
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
  source: /^media|sizes|src(?:set)?|type$/i,
  // alt, crossorigin, decoding, height (ulong), ismap (boolean),
  // referrerpolicy, sizes, src, srcset, usemap, width (ulong)
  img: r(
    `alt|crossorigin|decoding|${boundedElementAttrRegExpPart}|(?:is|use)map|${referElementAttrRegExpPart}(?:set)?|sizes`
  ),
  // allow, allowfullscreen (boolean), allowpaymentrequest (boolean), height,
  // name, referrerpolicy, src, srcdoc, sandbox, width
  iframe: r(
    `allow(?:fullscreen|paymentrequest)?|${boundedElementAttrRegExpPart}|name|${referElementAttrRegExpPart}(?:doc)?|sandbox`
  ),
  // height, src, type, width
  embed: r(`${boundedElementAttrRegExpPart}|src|type`),
  // data, form, height, name, type, usemap, width
  object: r(
    `data|form|${boundedElementAttrRegExpPart}|name|type|usemap`
  ),
  // name, value
  param: /^name|value$/i,
  // Extends HTMLMediaElement
  // autoplay, controls, crossorigin, height, loop, muted,
  // playsinline (boolean), poster, preload, src, width
  video: r(
    `${mediaElementAttrRegExpPart}|${boundedElementAttrRegExpPart}|playsinline|poster`
  ),
  // Extends HTMLMediaElement
  // autoplay, controls, crossorigin, loop, muted, preload, src
  audio: r(mediaElementAttrRegExpPart),
  // default (boolean), kind, label, src, srclang
  track: /^default|kind|label|src(?:lang)?$/i,
  map: /^name$/i,
  // Uses mixin HTMLHyperlinkElementUtils
  // alt, coords, download, href, name, ping, referrerpolicy, rel, shape, target
  area: r(
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
  td: r(tableCellElementAttrRegExpPart),
  // abbr, colspan (number), headers, rowspan (number), scope
  th: r(`abbr|${tableCellElementAttrRegExpPart}|scope`),

  // Forms
  // accept-charset, action, autocomplete, enctype, method, name,
  // novalidate (boolean), rel, target
  form: /^accept-charset|action|autocomplete|enctype|method|name|novalidate|rel|target$/i,
  // for
  label: /^for$/i,
  // accept, alt, autocomplete, autofocus (boolean), checked (boolean), dirname,
  // disabled (boolean), form, formaction, formenctype, formmethod,
  // formnovalidate (boolean), formtarget, height (number), list, max,
  // maxlength (number), min, minlength (number), multiple (boolean), name,
  // pattern, placeholder, readonly (boolean), required (boolean),
  // size (number), src, step, type, value, width
  input: r(
    `accept|alt|${formAssociatedAutoElementAttrRegExpPart}|checked|${textInputElementAttrRegExpPart}|${buttonElementAttrRegExpPart}|${boundedElementAttrRegExpPart}|list|m(?:ax|in)(?:length)?|${multipleInputElementAttrRegExpPart}|pattern|src|step`
  ),
  // autofocus (boolean), disabled (boolean), form, formaction, formenctype,
  // formmethod, formnovalidate (boolean), formtarget, name, type, value
  button: r(`autofocus|${buttonElementAttrRegExpPart}`),
  // autocomplete, autofocus (boolean), disabled (boolean), form,
  // multiple (boolean), name, required (boolean), size (number)
  select: r(
    `${formAssociatedAutoElementAttrRegExpPart}|${formAssociatedElementAttrRegExpPart}|${multipleInputElementAttrRegExpPart}`
  ),
  // Ignore <datalist>
  // disabled (boolean), label
  optgroup: r(optionElementAttrRegExpPart),
  // disabled, label, selected, value
  option: r(
    `${optionElementAttrRegExpPart}|selected|value`
  ),
  // autocomplete, autofocus (boolean), cols (number), dirname,
  // disabled (boolean), form, maxlength (number), minlength (number), name,
  // placeholder, readonly (boolean), required (boolean), rows (number), wrap
  textarea: r(
    `${formAssociatedAutoElementAttrRegExpPart}|(?:col|row)s|${textInputElementAttrRegExpPart}|${formAssociatedElementAttrRegExpPart}|m(?:ax|in)length|required|wrap`
  ),
  // for, form, name
  output: /^form?|name$/i,
  // max (double), value (double)
  progress: /^max|value$/i,
  // high (double), low (double), min (double), max (double), optimum (double),
  // value (double)
  meter: /^high|low|min|max|optimum|value$/i,
  // disabled (boolean), form, name
  fieldset: r(formAssociatedElementAttrRegExpPart),
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
  script: r(
    `async|${crossReferElementAttrRegExpPart}|defer|nomodule|${referElementAttrRegExpPart}`
  ),
  // Ignore <noscript>, <template>
  // name
  slot: /^name$/i,
  // height (ulong), width (ulong)
  canvas: r(boundedElementAttrRegExpPart),
}

export const isHTMLElementLocalAttribute = (
  tagName: LiteralUnion<keyof HTMLElementTagNameMap, string>,
  attrName: string
): boolean =>
  Boolean(
    htmlElementLocalAttributeMap[tagName as keyof HTMLElementTagNameMap]?.test(
      attrName
    )
  )

export const isHTMLElementAttribute = (
  tagName: keyof HTMLElementTagNameMap,
  attrName: string
): boolean =>
  isHTMLElementLocalAttribute(tagName, attrName) ||
  isHTMLElementGlobalAttribute(attrName)

export function getAttributeScalarValue(attr: {
  name: string
  value: string
}): string | number | boolean {
  const value: string = attr.value

  if ('' === value || attr.name.toLowerCase() === value.toLowerCase()) {
    return true
  }

  const numericValue: number = globalThis.parseFloat(value)

  return isNaN(numericValue) ? value : numericValue
}

// export const isBooleanAttr = makeMap(
//   'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
//     'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
//     'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
//     'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
//     'required,reversed,scoped,seamless,selected,sortable,translate,' +
//     'truespeed,typemustmatch,visible'
// )
//
// export const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')
//
// const isValidContentEditableValue = makeMap(
//   'events,caret,typing,plaintext-only'
// )

export const propsToAttrMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  defaultChecked: 'checked',
  defaultSelected: 'selected',
  defaultValue: 'value',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
}

const attrToPropsMap = {
  'accept-charset': 'acceptCharset',
  checked: 'defaultChecked',
  class: 'className',
  for: 'htmlFor',
  'http-equiv': 'httpEquiv',
  selected: 'defaultSelected',
  value: 'defaultValue',
}

//todo
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/ // eslint-disable-line no-control-regex
export const isSSRUnsafeAttr = (name: string): boolean => {
  return unsafeAttrCharRE.test(name)
}
