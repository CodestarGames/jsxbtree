import { Node } from "./nodes/Node";
export declare class BTreeManager {
    private trees;
    private timer;
    private static _instance;
    private nodeMap;
    private _treeGeneratorTasks;
    private currentGenerators;
    private workflo;
    private broadcastChannel;
    private constructor();
    static getInstance(): BTreeManager;
    start(Tree: (props: any) => BTree.Node, tick: number, blackboard: any, debugTarget: string): BTree.Node;
    onTickUpdate(tree: any): void;
    private processTick;
    update(dt: any): void;
    getParentByUid(uid: string): Node;
    addToNodeMap(item: Node): void;
    /**
     * Apply guard paths for every leaf node in the behaviour tree.
     */
    _applyLeafNodeGuardPaths(tree: BTree.Node): void;
    /**
     * Gets a multi-dimensional array of root->leaf node paths.
     * @returns A multi-dimensional array of root->leaf node paths.
     */
    _getAllNodePaths(tree: any): unknown[];
    /**
     * Gets the flattened details of every node in the tree.
     * @returns The flattened details of every node in the tree.
     */
    getFlattenedNodeDetails(Tree: any): any[];
    renderDebugger(container: Window, targetElem?: HTMLElement): void;
    openTreeviewPopup(): void;
}
//# sourceMappingURL=BTreeManager.d.ts.map