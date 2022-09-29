import { BTreeAttribute } from '../Decorators/BTreeAttribute';
/**
 * An UNTIL guard which is satisfied as long as the given Condition remains false.
 * @param Condition The name of the Condition function that determines whether the guard is satisfied.
 */
export default class Until extends BTreeAttribute {
    constructor(condition: any);
    /**
     * Gets whether the decorator is a guard.
     */
    isGuard: () => boolean;
    readonly condition: any;
    getDetails: () => {
        condition: any;
        type: string;
    };
    /**
     * Gets the Condition of the guard.
     */
    getCondition: () => any;
    /**
     * Gets whether the guard is satisfied.
     * @param blackboard The board.
     * @returns Whether the guard is satisfied.
     */
    isSatisfied: (blackboard: any) => boolean;
}
//# sourceMappingURL=Until.d.ts.map