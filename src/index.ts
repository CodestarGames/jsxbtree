/// <reference path="../types/JSX.d.ts" />

import {IWaitParams, WaitNode} from "./nodes/Wait";
import {FunctionCall, IFunctionCallProps} from "./nodes/FunctionCall";
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
import {NodeState} from "./nodeState";
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


//
// function jsx<T extends Node>(kind: T, attributes: { [key: string]: any } | null, ...children)
function jsx(kind: JSX.Tag | JSX.Component, attributes: { [key: string]: any } | null, ...children) {

    switch (kind) {
        case 'wait':
            return wrapLeafNode<WaitNode>(attributes ?? {} as IWaitParams, WaitNode);
            break;

        case 'functionCall':
            return wrapLeafNode<FunctionCall>(attributes ?? {} as IFunctionCallProps, FunctionCall);
            break;


        case 'parallel':
            return wrapCompositeNode<ParallelNode>(attributes ?? {} as ICompositeNodeParams, children, ParallelNode);
            break;


        case 'condition':
            return wrapLeafNode<ConditionNode>(attributes ?? {} as IConditionParams, ConditionNode);
            break;


        case 'lotto':
            return wrapCompositeNode<LottoNode>(attributes ?? {} as ICompositeNodeParams, children, LottoNode);
            break;


        case 'selector':
            return wrapCompositeNode<SelectorNode>(attributes ?? {} as ICompositeNodeParams, children, SelectorNode);
            break;

        case 'sequence':
            return wrapCompositeNode<SequenceNode>(attributes ?? {} as ICompositeNodeParams, children, SequenceNode);
            break;


        case 'repeat':
            return wrapCompositeNode<RepeatNode>(attributes ?? {} as IRepeatParams, children, RepeatNode);
            break;

        default:
            if (typeof kind === 'function') {
                let branchName = kind.name.indexOf('Act') > -1 ? undefined : kind.name;
                return kind({...attributes, branchName, children } ?? {branchName }, children);
            }
            else
                return null
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

export { LeafNode, CompositeNode, Action, NodeState, BTreeManager, wrapLeafNode, wrapCompositeNode, wrapActionNode, IBaseActionProps }

export default jsx;
