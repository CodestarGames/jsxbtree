import { LeafNode } from "./LeafNode";
import { BTreeCallbackFn } from "./Decorators/BTreeAttribute";
import { IBaseActionProps } from "../index";
/**
 * A Condition leaf node.
 * This will succeed or fail immediately based on a board predicate, without moving to the 'RUNNING' state.
 * **/
export declare class ConditionNode extends LeafNode {
    onUpdate(): void;
    getCaption(): string;
    type: string;
}
export interface IConditionParams extends IBaseActionProps {
    eq: BTreeCallbackFn;
}
//# sourceMappingURL=Condition.d.ts.map