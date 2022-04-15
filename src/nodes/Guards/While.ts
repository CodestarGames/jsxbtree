
import {BTreeAttribute, BTreeGuardFn} from "../Decorators/BTreeAttribute";

/**
 * An While guard which is satisfied as long as the given condition remains true.
 * @param condition The name of the condition function that determines whether the guard is satisfied.
 */
export default class While extends BTreeAttribute {

    constructor(condition: BTreeGuardFn | undefined) {
        super();
        this.condition = condition;
    }

    /**
     * Gets whether the decorator is a guard.
     */
    isGuard = () => true;
    readonly condition: any;

    getDetails = () => ({condition:this.condition?.name || 'anonymous', type: this.getType()});

    /**
     * Gets the condition of the guard.
     */
    getCondition = () => this.condition;


    /**
     * Gets whether the guard is satisfied.
     * @param blackboard The board.
     * @returns Whether the guard is satisfied.
     */
    isSatisfied = (blackboard: any): boolean => {

        return this.condition(blackboard) === true
    };

}
