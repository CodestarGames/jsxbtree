/**
 * A node container.
 */
export class NodeContainer {
    nodeContainer;
    parentContainer;
    childContainer;
    constructor() {
        this.nodeContainer = document.createElement("div");
        this.nodeContainer.className = "node-container";
        this.parentContainer = document.createElement("div");
        this.parentContainer.className = "parent-container";
        this.childContainer = document.createElement("div");
        this.childContainer.className = "child-container";
        this.nodeContainer.appendChild(this.parentContainer);
        this.nodeContainer.appendChild(this.childContainer);
    }
}
;
//# sourceMappingURL=nodecontainer.js.map