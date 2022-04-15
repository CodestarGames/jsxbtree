import {LeafNode} from "./nodes/LeafNode";
import {createDecoratorsFromProps} from "./nodes/Node";
import BTreeManager from "./BTreeManager";

export function wrapLeafNode<T extends LeafNode>(props, ctor: new (props) => T) {

    let leafNode = new ctor(props)
    leafNode.decorators = createDecoratorsFromProps(props)
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(leafNode);
    // let parent = manager.getParentByUid(props.parentUid);
    // parent.children.push(leafNode);
    return leafNode;
}
