import { GuardPath } from "./Guards/GuardUnsatisifedException";
import { BTreeAttribute, BTreeCallbackFn, BTreeGuardFn } from "./Decorators/BTreeAttribute";
import { NodeState } from "../NodeState";
export interface IDecoratorsFromJSXProps {
    while?: BTreeGuardFn;
    until?: BTreeGuardFn;
    entry?: BTreeCallbackFn;
    step?: BTreeCallbackFn;
    exit?: BTreeCallbackFn;
    cond?: BTreeGuardFn;
    alwaysSucceed?: any;
    alwaysFail?: any;
}
export interface INode {
    children: any[];
}
export declare abstract class Node implements INode {
    props: any;
    uid: string;
    blackboard: any;
    branchName: string;
    protected constructor(props?: any);
    getStateAsString(): "running" | "succeeded" | "failed" | "ready";
    get guardPath(): GuardPath;
    set guardPath(value: GuardPath);
    _decorators: BTreeAttribute[];
    _guardPath: GuardPath;
    get decorators(): BTreeAttribute[];
    set decorators(value: BTreeAttribute[]);
    getDecorator<T>(type: any): T;
    _children?: any[];
    get children(): any[];
    set children(value: any[]);
    state: NodeState;
    is(value: NodeState): boolean;
    setState(val: NodeState): void;
    reset(): void;
    getGuardDecorators(): BTreeAttribute[];
    abstract isLeafNode: any;
    hasGuardPath(): boolean;
    update(): void;
    postUpdate: () => void;
    abort(): void;
    abstract onUpdate(): void;
    abstract getCaption(): string;
    abstract type: string;
    private handleAlwaysSucceed;
    private handleAlwaysFail;
}
export declare function createDecoratorsFromProps(props: IDecoratorsFromJSXProps): BTreeAttribute[];
//# sourceMappingURL=Node.d.ts.map