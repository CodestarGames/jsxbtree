import {BTreeAttribute} from '../Decorators/BTreeAttribute'

/**
 * An UNTIL guard which is satisfied as long as the given condition remains false.
 * @param condition The name of the condition function that determines whether the guard is satisfied.
 */
export default class Until extends BTreeAttribute {

    constructor(condition) {
        super();
        this.condition = condition;
    }

    /**
     * Gets whether the decorator is a guard.
     */
    isGuard = () => true;
    readonly condition: any;

    getDetails = () => ({condition: this.condition?.name || 'anonymous', type: this.getType()});

    /**
     * Gets the condition of the guard.
     */
    getCondition = () => this.condition;


    /**
     * Gets whether the guard is satisfied.
     * @param blackboard The board.
     * @returns Whether the guard is satisfied.
     */
    isSatisfied = (blackboard) : boolean => {
       return this.condition(blackboard) === false
    };

}
