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
import {ActionNodeBase} from "./nodes/ActionNodeBase";
import {createDecoratorsFromProps, IDecoratorsFromJSXProps, Node} from "./nodes/Node";
import {LeafNode} from "./nodes/LeafNode";
import {Action} from "./nodes/Action";
import {NodeState} from "./NodeState";
import {BTreeManager} from "./BTreeManager";


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


const wrapActionNode = (ctor, props) => {

    let execActionNode = new ActionNodeBase(ctor, props);
    execActionNode.decorators = createDecoratorsFromProps(props);
    execActionNode.getCaption = () => `${typeof ctor.getCaption === 'function' ? ctor.getCaption(props) : ctor.name}`

    let manager = BTreeManager.getInstance()
    manager.addToNodeMap(execActionNode);
    return execActionNode;
}


    const Parallel = (attributes: ICompositeNodeParams, children) => wrapCompositeNode<ParallelNode>(attributes, children, ParallelNode);
    const Lotto = (attributes: ICompositeNodeParams, children) => wrapCompositeNode<LottoNode>(attributes, children, LottoNode);
    const Selector = (attributes: ICompositeNodeParams, children) => wrapCompositeNode<SelectorNode>(attributes, children, SelectorNode);
    const Sequence = (attributes: ICompositeNodeParams, children) => wrapCompositeNode<SequenceNode>(attributes, children, SequenceNode);
    const Repeat = (attributes: IRepeatParams, children) => wrapCompositeNode<RepeatNode>(attributes ?? {} as IRepeatParams, children, RepeatNode);

    const Wait = (attributes : IWaitParams) => wrapLeafNode<WaitNode>(attributes, WaitNode);
    const Condition = (attributes: IConditionParams) => wrapLeafNode<ConditionNode>(attributes ?? {} as IConditionParams, ConditionNode);
    const FunctionCall = (attributes: IFunctionCallProps) => wrapLeafNode<FunctionCallNode>(attributes, FunctionCallNode);

//
// function jsx<T extends Node>(kind: T, attributes: { [key: string]: any } | null, ...children)
function jsx(kind: JSX.Component, attributes: { [key: string]: any } | null, ...children) {

    if (typeof kind === 'function') {
        let branchName = kind.name.indexOf('Act') > -1 ? undefined : kind.name;
        return kind({...attributes, branchName, children } ?? {branchName }, children);
    }

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
    LeafNode,
    CompositeNode,
    Action,
    NodeState,
    BTreeManager,
    wrapLeafNode,
    wrapCompositeNode,
    wrapActionNode,
    IBaseActionProps,

    Wait,
    Lotto,
    Parallel,
    Selector,
    Sequence,
    Repeat,
    Condition,
    FunctionCall
}

export default jsx;
