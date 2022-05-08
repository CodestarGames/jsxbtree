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
import {IDecoratorsFromJSXProps, Node} from "./nodes/Node";
import {LeafNode} from "./nodes/LeafNode";
import {Action} from "./nodes/Action";
import {NodeState} from "./NodeState";
import {BTreeManager} from "./BTreeManager";
import {BTreeCallbackFn, BTreeGuardFn} from "./nodes/Decorators/Decorator";
import {ActiveSelectorNode} from "./nodes/ActiveSelectorNode";
import {RandomSequenceNode} from "./nodes/RandomSequenceNode";
import {WaitUntilStoppedNode} from "./nodes/WaitUntilStopped";
import Until from "./nodes/Decorators/Guards/Until";
import Entry from "./nodes/Decorators/CallBacks/Entry";
import Exit from "./nodes/Decorators/CallBacks/Exit";
import Step from "./nodes/Decorators/CallBacks/Step";
import While from "./nodes/Decorators/Guards/While";
import {Stops} from "./Stops";
import AlwaysFail from "./nodes/Decorators/AlwaysFail";
import AlwaysSucceed from "./nodes/Decorators/AlwaysSucceed";
import Service from "./nodes/Decorators/Service";


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
    compNode.decorators = props.decorators;
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(compNode);
    compNode.children = cloneChildren(children, {parentUid: compNode.uid});
    return compNode;

}

function wrapLeafNode<T extends LeafNode>(props, ctor: new (props) => T) {

    let leafNode = new ctor(props)
    leafNode.decorators = props.decorators;
    let manager = BTreeManager.getInstance();
    manager.addToNodeMap(leafNode);
    return leafNode;
}


const wrapActionNode = (ctor, props) => {

    let execActionNode = new ActionNodeBase(ctor, props);
    execActionNode.decorators = props.decorators;
    execActionNode.getCaption = () => `${typeof ctor.getCaption === 'function' ? ctor.getCaption(props) : ctor.name}`

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
const RandomSequence = (attributes: CompositeAttrParams, children) => wrapCompositeNode<RandomSequenceNode>(attributes, children, RandomSequenceNode);
const Repeat = (attributes: RepeatAttrParams, children) => wrapCompositeNode<RepeatNode>(attributes ?? {} as IRepeatParams, children, RepeatNode);

const Wait = (attributes : WaitAttrParams) => wrapLeafNode<WaitNode>(attributes, WaitNode);
const WaitUntilStopped = (attributes) => wrapLeafNode<WaitUntilStoppedNode>(attributes, WaitUntilStoppedNode);
const Condition = (attributes: ConditionAttrParams) => wrapLeafNode<ConditionNode>(attributes ?? {} as IConditionParams, ConditionNode);
const FunctionCall = (attributes: FunctionCallAttrParams) => wrapLeafNode<FunctionCallNode>(attributes, FunctionCallNode);


const BlackboardCondition = (fn: BTreeGuardFn, stops: Stops) => {}

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
    LeafNode,
    CompositeNode,
    Action,
    NodeState,
    BTreeManager,
    wrapLeafNode,
    wrapCompositeNode,
    wrapActionNode,
    IBaseActionProps,
    BTreeCallbackFn,

    Wait,
    WaitUntilStopped,
    Lotto,
    Parallel,
    Selector,
    ActiveSelector,
    Sequence,
    RandomSequence,
    Repeat,
    Condition,
    FunctionCall,

    While,
    Until,
    Entry,
    Exit,
    Step,
    BlackboardCondition,
    Service,
    AlwaysSucceed,
    AlwaysFail,

    Stops
}

export default jsx;
