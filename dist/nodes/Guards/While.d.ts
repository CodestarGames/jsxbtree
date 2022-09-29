import { BTreeAttribute, BTreeGuardFn } from "../Decorators/BTreeAttribute";
/**
 * An While guard which is satisfied as long as the given Condition remains true.
 * @param Condition The name of the Condition function that determines whether the guard is satisfied.
 */
export default class While extends BTreeAttribute {
    constructor(condition: BTreeGuardFn | undefined);
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
//# sourceMappingURL=While.d.ts.map