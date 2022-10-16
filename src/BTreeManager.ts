import {Timer} from "./Timer";
import {Node} from "./nodes/Node";
import {Workflo} from "./workflo/workflo";
import {NodeState} from "./NodeState";
import {GuardPath} from "./nodes/Guards/GuardUnsatisifedException";
import {CompositeNode} from "./nodes/CompositeNode";

interface ITreeData {
    tree: BTree.Node,
    tick: number,
    timerId: number
}

export class BTreeManager {
    private trees: Map<string, ITreeData>
    private timer: Timer;
    private static _instance: BTreeManager;
    private nodeMap: Map<string, Node>;
    private _treeGeneratorTasks: Map<BTree.Node, Array<any>>;
    private currentGenerators: Map<string, any>;
    private workflo: Workflo;
    private broadcastChannel: BroadcastChannel;

    private constructor() {
        this.timer = Timer.getInstance();
        this.nodeMap = new Map<string, Node>();
        this.trees = new Map<string, ITreeData>();
        this._treeGeneratorTasks = new Map<Node, Array<any>>();
        this.currentGenerators = new Map<string, any>();
        this.broadcastChannel = new BroadcastChannel('tree-debug');
    }

    static getInstance(): BTreeManager {
        if (!this._instance) {
            this._instance = new BTreeManager();
        }

        return this._instance;
    }

    start(Tree: (props: any) => BTree.Node, tick: number = -1, blackboard: any): BTree.Node {
        let treeInst = Tree({blackboard});

        this._applyLeafNodeGuardPaths(treeInst);
        this._treeGeneratorTasks.set(treeInst, [treeInst]);
        this.broadcastChannel = new BroadcastChannel('tree-debug');

        let timerId;
        if(tick !== -1)
            timerId = this.timer.addTimer(() => this.onTickUpdate(treeInst), tick, -1);

        this.trees.set(treeInst.uid, {tree: treeInst, tick, timerId});

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debugTree')) {
            this.openTreeviewPopup();
        }

        return treeInst;
    }

    resume(treeInst) {
        let {tick, tree} = this.trees.get(treeInst.uid);
        let timerId;
        if(tick !== -1)
            timerId = this.timer.addTimer(() => this.onTickUpdate(treeInst), tick, -1);

        this.trees.set(treeInst.uid, {tree, tick, timerId});
    }

    pause(treeInst) {
        let {timerId, tick, tree} = this.trees.get(treeInst.uid);
        this.timer.removeTimer(timerId);
        this.timer.clear();
        this.trees.set(treeInst.uid, {tree, tick, timerId: null});
    }

    removeTree(treeInst) {
        let {timerId} = this.trees.get(treeInst.uid);
        this.timer.removeTimer(timerId);
        this.timer.clear();
        this.trees.delete(treeInst.uid);
    }

    onTickUpdate(tree) {

        if (!this.currentGenerators.get(tree.uid))
            this.currentGenerators.set(tree.uid, this.processTick(tree));

        this.currentGenerators.get(tree.uid).next();

    }

    private* processTick(tree): IterableIterator<NodeState> {

        while (true) {

            let generatorTasks = this._treeGeneratorTasks.get(tree);
            // @ts-ignore
            let child = generatorTasks[0];
            child.update();

            //update the debugger
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debugTree')) {
                let nodes = this.getFlattenedNodeDetails(tree);
                this.broadcastChannel.postMessage(nodes);
            }

            if (child.state.done) {

                generatorTasks.shift();
                if (generatorTasks.length === 0) {
                    this._treeGeneratorTasks.set(tree, [tree]);
                    generatorTasks = this._treeGeneratorTasks.get(tree);
                    generatorTasks.forEach(child => child.reset());
                    this.currentGenerators.set(tree.uid, null);
                    break;
                }
            }

            yield child.state;

        }

        return NodeState.SUCCEEDED;
    }

    update(dt) {

        //updateState any trees that aren't on a specified tick.
        this.trees.forEach((value) => {
            if(value.tick === -1)
                this.onTickUpdate(value.tree);
        });

        this.timer.update(dt);
    }

    getParentByUid(uid: string) {
        let parent = this.nodeMap.get(uid);
        if (!parent) {
            throw new Error('no parent node found')
        }
        return parent;
    }

    addToNodeMap(item: Node) {
        this.nodeMap.set(item.uid, item)
    }

    destroy(tree: BTree.Node){
        let { timerId } = this.trees.get(tree.uid);
        this.timer.removeTimer(timerId);

        this._treeGeneratorTasks.delete(tree)
        this.currentGenerators.delete(tree.uid);
        this.trees.delete(tree.uid);

    }

    /**
     * Apply guard paths for every leaf node in the behaviour tree.
     */
    _applyLeafNodeGuardPaths(tree: BTree.Node) {

        this._getAllNodePaths(tree).forEach((path: Array<Node>) => {
            // Each node in the current path will have to be assigned a guard path, working from the root outwards.
            for (let depth = 0; depth < path.length; depth++) {
                // Get the node in the path at the current depth.
                const currentNode = path[depth];

                // The node may already have been assigned a guard path, if so just skip it.
                if (currentNode.hasGuardPath()) {
                    continue;
                }

                // Create the guard path for the current node.
                // Assign the guard path to the current node.
                currentNode.guardPath = new GuardPath(
                    path
                        .slice(0, depth + 1)
                        .map((node: Node) => ({node, guards: node.getGuardDecorators()}))
                        .filter((details) => details.guards.length > 0)
                );

            }
        });
    };

    /**
     * Gets a multi-dimensional array of root->leaf node paths.
     * @returns A multi-dimensional array of root->leaf node paths.
     */
    _getAllNodePaths(tree): unknown[] {
        const nodePaths = new Array<Node>();

        let blackboard = tree.blackboard;

        const findLeafNodes = (path: any, node) => {
            // Add the current node to the path.
            path = path.concat(node);
            node.blackboard = blackboard;
            node.props.blackboard = blackboard;

            // Check whether the current node is a leaf node.
            if (node.isLeafNode()) {
                nodePaths.push(path);
            } else {
                node.children.forEach((child: CompositeNode) => findLeafNodes(path, child));
            }
        };

        // Find all leaf node paths, starting from the root.
        findLeafNodes([], tree);
        return nodePaths;
    };

    /**
     * Gets the flattened details of every node in the tree.
     * @returns The flattened details of every node in the tree.
     */
    getFlattenedNodeDetails(Tree) {
        // Create an empty flattened array of tree
        const flattenedTreeNodes = new Array<any>();
        /**
         * Helper function to process a node instance and push details into the flattened tree nodes array.
         * @param node The current node.
         * @param parentUid The UID of the node parent, or null if the node is the main root node.
         */
        const processNode = (node: Node, parentUid: string) => {
            /**
             * Helper function to get details for all node decorators.
             * @param decorators The node decorators.
             * @returns The decorator details for a node.
             */
            const getDecoratorDetails = (decorators) =>
                decorators.length > 0 ? decorators.map((decorator) => decorator.getDetails()) : null;

            // Push the current node into the flattened nodes array.
            flattenedTreeNodes.push({
                id: node.uid,
                type: node.type,
                caption: node.getCaption() + `${node.branchName ? (" - " + node.branchName || node.props.slotName || '') : ''}`,
                state: node.getStateAsString(),
                decorators: getDecoratorDetails(node.decorators),
                parentId: parentUid
            });

            if (!node.isLeafNode()) {
                // Process each of the nodes children if it is not a leaf node.
                node.children.forEach((child) => processNode(child, node.uid));

            }
        };

        // Convert the nested node structure into a flattened array of node details.
        processNode(Tree, null);

        return flattenedTreeNodes;
    };

    openTreeviewPopup() {

        let newWindow = open('/?debugTreeChild=true', 'example', 'width=640,height=480')
        newWindow.focus();
        newWindow.onload = function () {

            let html = `<div id="loopVisualizer" style="background: white; width: 100%; height: 100%;"></div>`;
            newWindow.document.body.insertAdjacentHTML('afterbegin', html);

            let bc = new BroadcastChannel('tree-debug');
            bc.onmessage = event => {
                let nodes = event.data;
                // Build the tree view.
                var options = {
                    data: nodes,
                    nodeIdField: "id",
                    nodeNameField: "caption",
                    nodeTypeField: "type",
                    nodeParentField: "parentId",
                    definition: {
                        default: {
                            tooltip: function (node) {
                                return node.item.caption
                            },
                            template: (node) => {
                                if (node.item.decorators) {

                                    const getDecoratorHTMl = () =>
                                        node.item.decorators.map((decorator) => {
                                            return `<hr style="margin-top: 1px; margin-bottom: 1px;">
                                <i class='tree-view-caption'>${decorator.type.toUpperCase()} ${decorator.condition || decorator.executionFunc || ''}</i>`;
                                        }).join("");

                                    return `<div id="${node.item.id}" class='tree-view-node ${node.item.state}'>
                            <div class='tree-view-icon tree-view-icon-${node.item.type}'>
                           
                            </div>
                            <div>
                            <p class='tree-view-caption'>${node.item.caption}</p>
                            ${getDecoratorHTMl()}
                            </div>
                            </div>`;
                                } else {
                                    return `<div id="${node.item.id}" class='tree-view-node" ${node.item.state}'>
                            <div class='tree-view-icon tree-view-icon-${node.item.type}'>
                            </div>
                            <div><p class='tree-view-caption'>${node.item.caption}</p></div>
                            </div>`;
                                }
                            }
                        }
                    },
                    line: {
                        type: "angled",
                        thickness: 2,
                        colour: "#a3a1a1",
                        cap: "round"
                    },
                    layout: {
                        rootNodeOrientation: "vertical",
                        direction: "horizontal"
                    }
                };

                // @ts-ignore
                if (!newWindow.workFlo) {
                    // @ts-ignore
                    newWindow.workFlo = new Workflo(newWindow.document.getElementById('loopVisualizer'), options);
                } else {
                    // @ts-ignore
                    newWindow.workFlo.update(newWindow, nodes);
                }

            }

        };
    };

}
