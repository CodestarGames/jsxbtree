/**
 * A base node decorator.
 * @param type The node decorator type.
 */
export class BTreeAttribute {
    /**
     * Gets the type of the node.
     */
    getType = () => this.constructor.name;
    /**
     * Gets whether the decorator is a guard.
     */
    isGuard = () => false;
    /**
     * Gets the decorator details.
     */
    getDetails() {
        return { type: this.getType() };
    }
}
//# sourceMappingURL=BTreeAttribute.js.map