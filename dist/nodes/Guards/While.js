import { BTreeAttribute } from "../Decorators/BTreeAttribute";
/**
 * An While guard which is satisfied as long as the given Condition remains true.
 * @param Condition The name of the Condition function that determines whether the guard is satisfied.
 */
export default class While extends BTreeAttribute {
    constructor(condition) {
        super();
        this.condition = condition;
    }
    /**
     * Gets whether the decorator is a guard.
     */
    isGuard = () => true;
    condition;
    getDetails = () => ({ condition: this.condition?.name || 'anonymous', type: this.getType() });
    /**
     * Gets the Condition of the guard.
     */
    getCondition = () => this.condition;
    /**
     * Gets whether the guard is satisfied.
     * @param blackboard The board.
     * @returns Whether the guard is satisfied.
     */
    isSatisfied = (blackboard) => {
        return this.condition(blackboard) === true;
    };
}
//# sourceMappingURL=While.js.map