/// <reference path="../types/JSX.d.ts" />
import { IWaitParams, WaitNode } from "./nodes/Wait";
import { FunctionCallNode, IFunctionCallProps } from "./nodes/FunctionCallNode";
import { ParallelNode } from "./nodes/Parallel";
import { CompositeNode, ICompositeNodeParams } from "./nodes/CompositeNode";
import { ConditionNode, IConditionParams } from "./nodes/Condition";
import { LottoNode } from "./nodes/Lotto";
import { SelectorNode } from "./nodes/Selector";
import { SequenceNode } from "./nodes/Sequence";
import { IRepeatParams, RepeatNode } from "./nodes/Repeat";
import { ActionNode } from "./nodes/ActionNode";
import { IDecoratorsFromJSXProps, Node } from "./nodes/Node";
import { LeafNode } from "./nodes/LeafNode";
import { NodeState } from "./NodeState";
import { BTreeManager } from "./BTreeManager";
import { BTreeCallbackFn } from "./nodes/Decorators/BTreeAttribute";
import { ActiveSelectorNode } from "./nodes/ActiveSelectorNode";
import { RootNode } from "./nodes/Root";
export declare function cloneChildren(children: Node | Node[], props: any): any[];
declare function wrapCompositeNode<T extends CompositeNode>(props: any, children: Node[], ctor: new (props: any) => T): T;
declare function wrapLeafNode<T extends LeafNode>(props: any, ctor: new (props: any) => T): T;
declare function wrapActionNode<BB>(name: string, wrapperFn: (node: ActionNode<BB>) => boolean | NodeState, props: any, options?: {
    onComplete: () => void;
    waitForCompletion: boolean;
}): ActionNode<BB>;
declare type omitUnion = "parentUid" | "blackboard";
declare type CompositeAttrParams = Omit<ICompositeNodeParams, omitUnion>;
declare type RepeatAttrParams = Omit<IRepeatParams, omitUnion>;
declare type WaitAttrParams = Omit<IWaitParams, omitUnion>;
declare type ConditionAttrParams = Omit<IConditionParams, omitUnion>;
declare type FunctionCallAttrParams = Omit<IFunctionCallProps, omitUnion>;
declare const Parallel: (attributes: CompositeAttrParams) => ParallelNode;
declare const Lotto: (attributes: CompositeAttrParams) => LottoNode;
declare const Selector: (attributes: CompositeAttrParams) => SelectorNode;
declare const ActiveSelector: (attributes: CompositeAttrParams) => ActiveSelectorNode;
declare const Sequence: (attributes: CompositeAttrParams) => SequenceNode;
declare const Root: (attributes: CompositeAttrParams) => RootNode;
declare const Repeat: (attributes: RepeatAttrParams) => RepeatNode;
declare const Wait: (attributes: WaitAttrParams) => WaitNode;
declare const Condition: (attributes: ConditionAttrParams) => ConditionNode;
declare const FunctionCall: (attributes: FunctionCallAttrParams) => FunctionCallNode;
declare function BtreeJSX(kind: JSX.Component, attributes: {
    [key: string]: any;
} | null, ...children: any[]): BTree.Node;
export declare const Fragment: (props: any, ...children: any[]) => any[];
interface IBaseActionProps extends IDecoratorsFromJSXProps {
    parentUid?: any;
    conditions?: any;
    blackboard?: any;
}
export { Root, LeafNode, CompositeNode, NodeState, BTreeManager, wrapLeafNode, wrapCompositeNode, wrapActionNode, IBaseActionProps, BTreeCallbackFn, Wait, Lotto, Parallel, Selector, ActiveSelector, Sequence, Repeat, Condition, FunctionCall };
export default BtreeJSX;
//# sourceMappingURL=index.d.ts.map