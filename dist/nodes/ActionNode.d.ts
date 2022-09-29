import { LeafNode } from "../nodes/LeafNode";
import { NodeState } from "../NodeState";
export declare class ActionNode<BB> extends LeafNode {
    readonly wrapperFn: (node: ActionNode<BB>) => boolean | NodeState;
    readonly props: any;
    private updatePromiseStateResult;
    private isUsingUpdatePromise;
    waitForCompletion: boolean;
    onComplete: () => void;
    constructor(wrapperFn: (node: ActionNode<BB>) => boolean | NodeState, props: any, options?: {
        waitForCompletion: any;
        onComplete: any;
    });
    getCaption(): string;
    type: string;
    reset(): void;
    onUpdate(): void;
    _validateUpdateResult(result: any): void;
}
//# sourceMappingURL=ActionNode.d.ts.map