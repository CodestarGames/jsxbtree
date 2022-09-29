/**
 * An exception thrown when evaluating node guard path conditions and a conditions fails.
 * @param source The node at which a guard Condition failed.
 */
export declare class GuardUnsatisifedException extends Error {
    private readonly source;
    constructor(source: any);
    /**
     * The exception message.
     */
    static message: string;
    /**
     * Gets whether the specified node is the node at which a guard Condition failed.
     * @param node The node to check against the source node.
     * @returns Whether the specified node is the node at which a guard Condition failed.
     */
    isSourceNode: (node: any) => boolean;
}
/**
 * Represents a path of node guards along a root-to-leaf tree path.
 * @param nodes An array of objects defining a node getInstance -> guard link, ordered by node depth.
 */
export declare class GuardPath {
    private readonly nodes;
    constructor(nodes: any);
    /**
     * Evaluate guard conditions for all guards in the tree path, moving outwards from the root.
     * @param blackboard The blackboard, required for guard evaluation.
     * @returns An evaluation results object.
     */
    evaluate(blackboard: any): void;
}
//# sourceMappingURL=GuardUnsatisifedException.d.ts.map