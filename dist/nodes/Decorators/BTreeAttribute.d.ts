/**
 * A base node decorator.
 * @param type The node decorator type.
 */
export declare abstract class BTreeAttribute {
    /**
     * Gets the type of the node.
     */
    getType: () => string;
    /**
     * Gets whether the decorator is a guard.
     */
    isGuard: () => boolean;
    /**
     * Gets the decorator details.
     */
    getDetails(): {
        type: string;
    };
}
export declare type BTreeCallbackFn = (blackboard?: any) => void;
export declare type BTreeGuardFn = (blackboard?: any) => boolean;
//# sourceMappingURL=BTreeAttribute.d.ts.map