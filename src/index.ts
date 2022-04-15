/// <reference path="../types/JSX.d.ts" />

import {IWaitParams, WaitNode} from "./nodes/Wait";
import {FunctionCall, IFunctionCallProps} from "./nodes/FunctionCall";
import {ParallelNode} from "./nodes/Parallel";
import {ICompositeNodeParams} from "./nodes/CompositeNode";
import {ConditionNode, IConditionParams} from "./nodes/Condition";
import {LottoNode} from "./nodes/Lotto";
import {SelectorNode} from "./nodes/Selector";
import {SequenceNode} from "./nodes/Sequence";
import {IRepeatParams, RepeatNode} from "./nodes/Repeat";
import {wrapLeafNode} from "./wrapLeafNode";
import {wrapCompositeNode} from "./wrapCompositeNode";


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

export default jsx;
