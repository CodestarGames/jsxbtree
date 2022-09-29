import { NodeContainer } from "./nodecontainer";
import { Node } from "./node";
export class Workflo {
    _defaultOptions;
    _target;
    _options;
    _rootNodes;
    _rootNodeContainer;
    layoutDirection;
    constructor(target, options) {
        // The default options.
        this._defaultOptions = {};
        // The target container.
        this._target = target;
        // The options.
        this._options = options;
        // The root 
        this._rootNodes;
        // The root node container.
        this._rootNodeContainer;
        // The node layout direction.
        this.layoutDirection;
        this._init();
    }
    /**
     * Initialisation.
     */
    _init() {
        // Create the control.
        this._createControl(this._options.layout || {});
        // Create the node tree based on the data items passed as an option.
        this._populateNodeTree(this._options.data || []);
        // Populate the root node container with nested node containers based on our node tree.
        this._populateRootNodeContainer();
    }
    ;
    /**
     * Build the actual control into the target container.
     * @param layout The control layout options.
     */
    _createControl(layout) {
        // Determine the layout direction of our 
        this.layoutDirection = (layout.direction && layout.direction.toLowerCase() === "vertical") ? "vertical" : "horizontal";
        // Apply the workflo-container class to the target element.
        this._target.className += " workflo-container workflo-direction-" + this.layoutDirection;
        // Wrap the root nodes container in a row container to center it vertically.
        var rootNodeContainerRow = document.createElement("div");
        rootNodeContainerRow.className = "root-node-container-row";
        this._target.appendChild(rootNodeContainerRow);
        // Wrap the root nodes container in a div.
        var rootNodeContainer = document.createElement("div");
        rootNodeContainer.className = "root-node-container";
        rootNodeContainerRow.appendChild(rootNodeContainer);
        // Grab a reference to the root node container.
        this._rootNodeContainer = rootNodeContainer;
    }
    ;
    /**
     * Populate the node tree based on the data items passed in via the options.
     */
    _populateNodeTree(dataItems) {
        // Check that we have an id property.
        if (!this._options.nodeIdField) {
            throw "no id property was defined in options.";
        }
        // A function to recursively create and append child nodes to a parent node.
        var createAndAppendChildNodes = (parent, items, options) => {
            // Look for any items which are a child of the parent node.
            for (var i = 0; i < items.length; i++) {
                // Get the current item.
                var item = items[i];
                var itemParentId = item[options.nodeParentField];
                // If this items parent is the parent node then hook them up.
                if (itemParentId && itemParentId === parent.id()) {
                    // Create the child node.
                    var childNode = new Node(item, options, this.layoutDirection);
                    // Set the depth of the node.
                    childNode.depth = parent.depth + 1;
                    // Add the child node as a child of the parent.
                    parent.children.push(childNode);
                    // Create and append child nodes to this child node.
                    createAndAppendChildNodes(childNode, items, options);
                }
            }
        };
        // Firstly, we need to find the root 
        var rootNodes = [];
        for (var i = 0; i < dataItems.length; i++) {
            // Get the current item.
            var item = dataItems[i];
            // If this item has no parent then we treat it as a root node.
            if (!item[this._options.nodeParentField]) {
                // Create the root node.
                var rootNode = new Node(item, this._options, this.layoutDirection);
                // Create and append child nodes to this root node.
                createAndAppendChildNodes(rootNode, dataItems, this._options);
                // Add the root node.
                rootNodes.push(rootNode);
            }
        }
        // Set the root 
        this._rootNodes = rootNodes;
    }
    ;
    /**
     * Populate the root node container with nested node containers based on our node tree.
     */
    _populateRootNodeContainer() {
        var fill = (children, childContainer) => {
            for (var i = 0; i < children.length; i++) {
                // Get the current child.
                var child = children[i];
                // Create a node container for this child.
                var container = new NodeContainer();
                // Create the parent node element and inject it into parent-container.
                child.attachToParentContainer(container.parentContainer);
                // Inject the node-container into the outer child container.
                childContainer.appendChild(container.nodeContainer);
                // Repeat this process for ever child of the current child, if there are any.
                if (child.children.length > 0) {
                    fill(child.children, container.childContainer);
                    // Draw the connectors for this child.
                    child.drawConnectors();
                }
            }
        };
        // Populate the target container with the nested node containers.
        fill(this._rootNodes, this._rootNodeContainer);
    }
    /**
     * Refresh the getInstance.
     */
    refresh(data) {
        // Empty the root node container.
        this._rootNodeContainer.innerHTML = "";
        // Re-populate the node tree.
        this._populateNodeTree(data || this._options.data || []);
        // Populate the root node container with nested node containers based on our node tree.
        this._populateRootNodeContainer();
    }
    update(window, data) {
        data.forEach(item => {
            let elem = window.document.getElementById(item.id);
            elem.setAttribute('class', `tree-view-node ${item.state}`);
        });
    }
    /**
     * Destroy this getInstance.
     */
    destroy() {
    }
}
;
//# sourceMappingURL=workflo.js.map