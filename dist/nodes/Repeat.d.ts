import { CompositeNode, ICompositeNodeParams } from "./CompositeNode";
export interface IRepeatParams extends ICompositeNodeParams {
    iterations?: number | (() => number);
}
export declare class RepeatNode extends CompositeNode {
    readonly props: IRepeatParams;
    private _iterations;
    get _child(): any;
    private currentIterationCount;
    private targetIterationCount;
    /**
     * A REPEAT node.
     * The node has a single child which can have:
     * -- A number of iterations for which to Repeat the child node.
     * -- An infinite Repeat loop if neither an iteration count or a Condition function is defined.
     * The REPEAT node will stop and have a 'FAILED' state if its child is ever in a 'FAILED' state after an updateState.
     * The REPEAT node will attempt to move on to the next iteration if its child is ever in a 'SUCCEEDED' state.
     * @param props
     */
    constructor(props: IRepeatParams);
    _canIterate(): boolean;
    onUpdate(): void;
    _setTargetIterationCount(): void;
    getCaption(): string;
    type: string;
}
//# sourceMappingURL=Repeat.d.ts.map