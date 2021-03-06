/// <reference path="../types/JSX.d.ts" />

import {IWaitParams, WaitNode} from "./nodes/Wait";
import {FunctionCallNode, IFunctionCallProps} from "./nodes/FunctionCallNode";
import {ParallelNode} from "./nodes/Parallel";
import {CompositeNode, ICompositeNodeParams} from "./nodes/CompositeNode";
import {ConditionNode, IConditionParams} from "./nodes/Condition";
import {LottoNode} from "./nodes/Lotto";
import {SelectorNode} from "./nodes/Selector";
import {SequenceNode} from "./nodes/Sequence";
import {IRepeatParams, RepeatNode} from "./nodes/Repeat";
import {ActionNode} from "./nodes/ActionNode";
import {createDecoratorsFromProps, IDecoratorsFromJSXProps, Node} from "./nodes/Node";
import {LeafNode} from "./nodes/LeafNode";
import {NodeState} from "./NodeState";
import {BTreeManager} from "./BTreeManager";
import { BTreeCallbackFn } from "./nodes/Decorators/BTreeAttribute";
import {ActiveSelectorNode} from "./nodes/ActiveSelectorNode";
import {RootNode} from "./nodes/Root";


//JSX specific functions
////////////////////////

export function cloneChildren(children: Node | Node[], props: any) {
    let list: Node[] = [];
    if (Array.isArray(children) === false)
        list.push(children as Node);
    else
        list = children as Node[];

    return list.map((child: Node) => {
        return child && Object.assign(child, Object.assign({
            parentUid: props.parentUid
        }));
    });

}

function wrapCompositeNode<T extends CompositeNode>(props, children: Node[], ctor: new (props) => T) {

    let compNode = new ctor(props)
    compNode.decorators = createDecoratorsFromProps(props)
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(compNode);
    compNode.children = cloneChildren(children, {parentUid: compNode.uid});
    return compNode;

}

function wrapLeafNode<T extends LeafNode>(props, ctor: new (props) => T) {

    let leafNode = new ctor(props)
    leafNode.decorators = createDecoratorsFromProps(props)
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(leafNode);
    return leafNode;
}

function wrapActionNode<BB>(name: string, wrapperFn: (node: ActionNode<BB>) => boolean | NodeState, props, options?: { onComplete: () => void; waitForCompletion: boolean }) {

    let execActionNode = new ActionNode<BB>(wrapperFn, props, options);

    execActionNode.decorators = createDecoratorsFromProps(props);
    execActionNode.getCaption = () => `${name}`

    let manager = BTreeManager.getInstance()
    manager.addToNodeMap(execActionNode);
    return execActionNode;

}

type omitUnion = "children" | "parentUid"|"blackboard"
type CompositeAttrParams = Omit<ICompositeNodeParams, omitUnion>;
type RepeatAttrParams = Omit<IRepeatParams, omitUnion>;
type WaitAttrParams = Omit<IWaitParams, omitUnion>;
type ConditionAttrParams = Omit<IConditionParams, omitUnion>;
type FunctionCallAttrParams = Omit<IFunctionCallProps, omitUnion>;

const Parallel = (attributes: CompositeAttrParams, children) => wrapCompositeNode<ParallelNode>(attributes, children, ParallelNode);
const Lotto = (attributes: CompositeAttrParams, children) => wrapCompositeNode<LottoNode>(attributes, children, LottoNode);
const Selector = (attributes: CompositeAttrParams, children) => wrapCompositeNode<SelectorNode>(attributes, children, SelectorNode);
const ActiveSelector = (attributes: CompositeAttrParams, children) => wrapCompositeNode<ActiveSelectorNode>(attributes, children, ActiveSelectorNode);
const Sequence = (attributes: CompositeAttrParams, children) => wrapCompositeNode<SequenceNode>(attributes, children, SequenceNode);
const Root = (attributes: CompositeAttrParams, children) => wrapCompositeNode<RootNode>(attributes, children, RootNode);
const Repeat = (attributes: RepeatAttrParams, children) => wrapCompositeNode<RepeatNode>(attributes ?? {} as IRepeatParams, children, RepeatNode);

const Wait = (attributes : WaitAttrParams) => wrapLeafNode<WaitNode>(attributes, WaitNode);
const Condition = (attributes: ConditionAttrParams) => wrapLeafNode<ConditionNode>(attributes ?? {} as IConditionParams, ConditionNode);
const FunctionCall = (attributes: FunctionCallAttrParams) => wrapLeafNode<FunctionCallNode>(attributes, FunctionCallNode);

//
// function jsx<T extends Node>(kind: T, attributes: { [key: string]: any } | null, ...children)
function jsx(kind: JSX.Component, attributes: { [key: string]: any } | null, ...children) {

    let branchName = kind.name.indexOf('Act') > -1 ? undefined : kind.name;
    return kind({...attributes, branchName, children } ?? {branchName }, children);


}


export const Fragment = (props, ...children) => {
    return children;
};

interface IBaseActionProps extends IDecoratorsFromJSXProps {
    parentUid?,
    conditions?: any
    blackboard?: any
}

export {
    Root,
    LeafNode,
    CompositeNode,
    NodeState,
    BTreeManager,
    wrapLeafNode,
    wrapCompositeNode,
    wrapActionNode,
    IBaseActionProps,
    BTreeCallbackFn,

    Wait,
    Lotto,
    Parallel,
    Selector,
    ActiveSelector,
    Sequence,
    Repeat,
    Condition,
    FunctionCall
}

export default jsx;
