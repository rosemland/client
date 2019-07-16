import forEach from 'lodash/forEach'
import { DOMHydrator, DOMRenderer, NodeType } from '@rosemlab/dom-api'
import {
  VirtualContentNode,
  VirtualElement,
  VirtualInstance,
  VirtualNode,
  VirtualAttr,
  VirtualParentNode,
} from '.'

export default class VDOMHydrator<OutputNode>
  implements DOMHydrator<VirtualNode, OutputNode> {
  public hydrate<
    VirtualElementProps extends object,
    ParentNode extends OutputNode,
    DocumentFragment extends ParentNode,
    Element extends ParentNode,
    Text extends OutputNode,
    Comment extends OutputNode = OutputNode,
    CDATASection extends OutputNode = OutputNode
  >(
    inputNode: VirtualInstance<VirtualElementProps>,
    renderer: DOMRenderer<
      OutputNode,
      ParentNode,
      DocumentFragment,
      Element,
      Text,
      Comment,
      CDATASection
    >
  ): OutputNode {
    switch (inputNode.type) {
      case NodeType.DOCUMENT_FRAGMENT_NODE: {
        const documentFragment: DocumentFragment = renderer.createDocumentFragment()

        this.appendVirtualNodeList(
          documentFragment,
          (inputNode as VirtualParentNode).children as VirtualInstance<
            VirtualElementProps
          >[],
          renderer
        )

        return documentFragment
      }
      case NodeType.ELEMENT_NODE: {
        const element: Element = (inputNode as VirtualElement).namespaceURI
          ? renderer.createElementNS(
              (inputNode as VirtualElement).namespaceURI,
              (inputNode as VirtualElement).tagName
            )
          : renderer.createElement((inputNode as VirtualElement).tagName)

        if ((inputNode as VirtualElement).attrs) {
          forEach((inputNode as VirtualElement).attrs, function(
            attr: VirtualAttr,
            key: string
          ) {
            null == attr.namespaceURI
              ? renderer.setAttribute(element, key, attr.value)
              : renderer.setAttributeNS(
                  element,
                  attr.namespaceURI,
                  key,
                  attr.value
                )
          })
        }

        this.appendVirtualNodeList(
          element,
          (inputNode as VirtualParentNode).children as VirtualInstance<
            VirtualElementProps
          >[],
          renderer
        )

        return element
      }
      case NodeType.TEXT_NODE:
        return renderer.createText(
          String((inputNode as VirtualContentNode).text)
        )
      case NodeType.COMMENT_NODE:
        return renderer.createComment(
          String((inputNode as VirtualContentNode).text)
        )
      case NodeType.CDATA_SECTION_NODE:
        return renderer.createCDATASection(
          String((inputNode as VirtualContentNode).text)
        )
    }

    throw new Error('Unknown type of node')
  }

  protected appendVirtualNodeList<
    VirtualElementProps extends object,
    ParentNode extends OutputNode,
    DocumentFragment extends ParentNode,
    Element extends ParentNode,
    Text extends OutputNode,
    Comment extends OutputNode = OutputNode,
    CDATASection extends OutputNode = OutputNode
  >(
    parent: DocumentFragment | Element,
    nodeList: VirtualInstance<VirtualElementProps>[],
    renderer: DOMRenderer<
      OutputNode,
      ParentNode,
      DocumentFragment,
      Element,
      Text,
      Comment,
      CDATASection
    >
  ): void {
    if (nodeList) {
      for (const child of nodeList) {
        if (null != child) {
          renderer.appendChild(parent, this.hydrate(child, renderer))
        }
      }
    }
  }
}
