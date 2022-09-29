export declare class NodeState {
    static SUCCEEDED: NodeState;
    static FAILED: NodeState;
    static RUNNING: NodeState;
    static READY: NodeState;
    static is(value: NodeState, state: NodeState): boolean;
    succeeded: boolean;
    done: boolean;
    constructor({ succeeded, done }: {
        succeeded: any;
        done: any;
    });
}
//# sourceMappingURL=NodeState.d.ts.map