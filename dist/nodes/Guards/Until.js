import { BTreeAttribute } from '../Decorators/BTreeAttribute';
/**
 * An UNTIL guard which is satisfied as long as the given Condition remains false.
 * @param Condition The name of the Condition function that determines whether the guard is satisfied.
 */
export default class Until extends BTreeAttribute {
    constructor(condition) {
        super();
        /**
         * Gets whether the decorator is a guard.
         */
        this.isGuard = () => true;
        this.getDetails = () => ({ condition: this.condition?.name || 'anonymous', type: this.getType() });
        /**
         * Gets the Condition of the guard.
         */
        this.getCondition = () => this.condition;
        /**
         * Gets whether the guard is satisfied.
         * @param blackboard The board.
         * @returns Whether the guard is satisfied.
         */
        this.isSatisfied = (blackboard) => {
            return this.condition(blackboard) === false;
        };
        this.condition = condition;
    }
}
//# sourceMappingURL=Until.js.map