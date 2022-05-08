/**
 * An While guard which is satisfied as long as the given Condition remains true.
 * @param Condition The name of the Condition function that determines whether the guard is satisfied.
 */
import {BTreeGuardFn, Decorator} from "../Decorator";

export default class While extends Decorator {

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
     * Gets the Condition of the guard.
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
