/**
 * A base node decorator.
 * @param type The node decorator type.
 */
export class BTreeAttribute {
    constructor() {
        /**
         * Gets the type of the node.
         */
        this.getType = () => this.constructor.name;
        /**
         * Gets whether the decorator is a guard.
         */
        this.isGuard = () => false;
    }
    /**
     * Gets the decorator details.
     */
    getDetails() {
        return { type: this.getType() };
    }
}
//# sourceMappingURL=BTreeAttribute.js.map