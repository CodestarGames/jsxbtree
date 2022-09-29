/**
 * An exception thrown when evaluating node guard path conditions and a conditions fails.
 * @param source The node at which a guard Condition failed.
 */
export class GuardUnsatisifedException extends Error {
    source;
    constructor(source) {
        super(GuardUnsatisifedException.message);
        Object.setPrototypeOf(this, GuardUnsatisifedException.prototype);
        this.source = source;
    }
    /**
     * The exception message.
     */
    static message = "A guard path Condition has failed";
    /**
     * Gets whether the specified node is the node at which a guard Condition failed.
     * @param node The node to check against the source node.
     * @returns Whether the specified node is the node at which a guard Condition failed.
     */
    isSourceNode = (node) => node === this.source;
}
/**
 * Represents a path of node guards along a root-to-leaf tree path.
 * @param nodes An array of objects defining a node getInstance -> guard link, ordered by node depth.
 */
export class GuardPath {
    nodes;
    constructor(nodes) {
        this.nodes = nodes;
    }
    /**
     * Evaluate guard conditions for all guards in the tree path, moving outwards from the root.
     * @param blackboard The blackboard, required for guard evaluation.
     * @returns An evaluation results object.
     */
    evaluate(blackboard) {
        // We need to evaluate guard conditions for nodes up the tree, moving outwards from the root.
        for (const details of this.nodes) {
            // There can be multiple guards per node.
            for (const guard of details.guards) {
                // Check whether the guard Condition passes, and throw an exception if not.
                if (!guard.isSatisfied(blackboard)) {
                    throw new GuardUnsatisifedException(details.node);
                }
            }
        }
    }
}
//# sourceMappingURL=GuardUnsatisifedException.js.map