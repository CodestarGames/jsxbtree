export declare class Node {
    private item;
    depth: number;
    private children;
    private _connectorSVG;
    private _parentContainer;
    private _options;
    private _direction;
    /**
     * A node.
     */
    constructor(item: any, options: any, direction: any);
    parent(): any;
    /**
         * Get the height of this node in the DOM.
         */
    getHeight(): any;
    /**
         * Returns whether this is a root node.
         */
    isRoot(): boolean;
    /**
         * Appends the node DOM element to a parent element.
         */
    attachToParentContainer(parent: any): void;
    /**
         * Get the template function to use for creating the node element.
         */
    _getTemplateFunction(definition: any): any;
    name(): any;
    /**
         * Draw the parent -> child connectors for this node.
         */
    drawConnectors(): void;
    /**
         * Get the width of this node in the DOM.
         */
    getWidth(): any;
    id(): any;
    type(): any;
    /**
         * Find an additional definition by type.
         * Returns undefined if one does not exist.
         */
    _findAdditionalDefinitionByType(definition: any, typeValue: any): any;
}
//# sourceMappingURL=node.d.ts.map