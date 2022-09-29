/// <reference path="../types/JSX.d.ts" />
import { WaitNode } from "./nodes/Wait";
import { FunctionCallNode } from "./nodes/FunctionCallNode";
import { ParallelNode } from "./nodes/Parallel";
import { CompositeNode } from "./nodes/CompositeNode";
import { ConditionNode } from "./nodes/Condition";
import { LottoNode } from "./nodes/Lotto";
import { SelectorNode } from "./nodes/Selector";
import { SequenceNode } from "./nodes/Sequence";
import { RepeatNode } from "./nodes/Repeat";
import { ActionNode } from "./nodes/ActionNode";
import { createDecoratorsFromProps } from "./nodes/Node";
import { LeafNode } from "./nodes/LeafNode";
import { NodeState } from "./NodeState";
import { BTreeManager } from "./BTreeManager";
import { ActiveSelectorNode } from "./nodes/ActiveSelectorNode";
import { RootNode } from "./nodes/Root";
//JSX specific functions
////////////////////////
export function cloneChildren(children, props) {
    let list = [];
    if (Array.isArray(children) === false)
        list.push(children);
    else
        list = children;
    return list.map((child) => {
        return child && Object.assign(child, Object.assign({
            parentUid: props.parentUid
        }));
    });
}
function wrapCompositeNode(props, children, ctor) {
    let compNode = new ctor(props);
    compNode.decorators = createDecoratorsFromProps(props);
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(compNode);
    compNode.children = cloneChildren(children, { parentUid: compNode.uid });
    compNode.key = compNode.uid;
    return compNode;
}
function wrapLeafNode(props, ctor) {
    let leafNode = new ctor(props);
    leafNode.decorators = createDecoratorsFromProps(props);
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(leafNode);
    leafNode.key = leafNode.uid;
    return leafNode;
}
function wrapActionNode(name, wrapperFn, props, options) {
    let execActionNode = new ActionNode(wrapperFn, props, options);
    execActionNode.decorators = createDecoratorsFromProps(props);
    execActionNode.getCaption = () => `${name}`;
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(execActionNode);
    return execActionNode;
}
const Parallel = (attributes) => wrapCompositeNode(attributes, attributes.children, ParallelNode);
const Lotto = (attributes) => wrapCompositeNode(attributes, attributes.children, LottoNode);
const Selector = (attributes) => wrapCompositeNode(attributes, attributes.children, SelectorNode);
const ActiveSelector = (attributes) => wrapCompositeNode(attributes, attributes.children, ActiveSelectorNode);
const Sequence = (attributes) => wrapCompositeNode(attributes, attributes.children, SequenceNode);
const Root = (attributes) => wrapCompositeNode(attributes, attributes.children, RootNode);
const Repeat = (attributes) => wrapCompositeNode(attributes ?? {}, attributes.children, RepeatNode);
const Wait = (attributes) => wrapLeafNode(attributes, WaitNode);
const Condition = (attributes) => wrapLeafNode(attributes ?? {}, ConditionNode);
const FunctionCall = (attributes) => wrapLeafNode(attributes, FunctionCallNode);
//
// function jsx<T extends Node>(kind: T, attributes: { [key: string]: any } | null, ...children)
function BtreeJSX(kind, attributes, ...children) {
    let branchName = kind.name.indexOf('Act') > -1 ? undefined : kind.name;
    return kind({ ...attributes, branchName, children } ?? { branchName }, children);
}
export const Fragment = (props, ...children) => {
    return children;
};
export { Root, LeafNode, CompositeNode, NodeState, BTreeManager, wrapLeafNode, wrapCompositeNode, wrapActionNode, Wait, Lotto, Parallel, Selector, ActiveSelector, Sequence, Repeat, Condition, FunctionCall };
export default BtreeJSX;
//# sourceMappingURL=index.js.map