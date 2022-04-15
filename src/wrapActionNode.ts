import {ActionNodeBase} from "./nodes/ActionNodeBase";
import {createDecoratorsFromProps} from "./nodes/Node";
import BTreeManager from "./BTreeManager";

export const wrapActionNode = (ctor, props) => {

    let execActionNode = new ActionNodeBase(ctor, props);
    execActionNode.decorators = createDecoratorsFromProps(props);
    execActionNode.getCaption = () => `${typeof ctor.getCaption === 'function' ? ctor.getCaption(props) : ctor.name}`

    let manager = BTreeManager.getInstance()
    manager.addToNodeMap(execActionNode);
    // let parent = manager.getParentByUid(props.parentUid);
    // parent.children.push(execActionNode);

    return execActionNode;
}

