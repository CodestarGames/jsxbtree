import {CompositeNode} from "./nodes/CompositeNode";
import {createDecoratorsFromProps, Node} from "./nodes/Node";
import BTreeManager from "./BTreeManager";
import {cloneChildren} from "./cloneChildren";

export function wrapCompositeNode<T extends CompositeNode>(props, children: Node[], ctor: new (props) => T) {

    let compNode = new ctor(props)
    compNode.decorators = createDecoratorsFromProps(props)
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(compNode);
    // let parent = manager.getParentByUid(props.parentUid);
    // parent.children.push(compNode);
    compNode.children = cloneChildren(children, {parentUid: compNode.uid});
    return compNode;

}
