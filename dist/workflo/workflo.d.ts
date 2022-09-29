export declare class Workflo {
    private _defaultOptions;
    private _target;
    private _options;
    private _rootNodes;
    private _rootNodeContainer;
    private layoutDirection;
    constructor(target: any, options: any);
    /**
     * Initialisation.
     */
    _init(): void;
    /**
     * Build the actual control into the target container.
     * @param layout The control layout options.
     */
    _createControl(layout: any): void;
    /**
     * Populate the node tree based on the data items passed in via the options.
     */
    _populateNodeTree(dataItems: any): void;
    /**
     * Populate the root node container with nested node containers based on our node tree.
     */
    _populateRootNodeContainer(): void;
    /**
     * Refresh the getInstance.
     */
    refresh(data: any): void;
    update(window: any, data: any): void;
    /**
     * Destroy this getInstance.
     */
    destroy(): void;
}
//# sourceMappingURL=workflo.d.ts.map