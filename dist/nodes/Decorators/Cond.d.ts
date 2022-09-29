import { BTreeAttribute, BTreeGuardFn } from "./BTreeAttribute";
export default class Cond extends BTreeAttribute {
    conditionFunc: BTreeGuardFn;
    constructor(conditionFunc: BTreeGuardFn);
    getDetails(): {
        executionFunc: string;
        type: string;
    };
    evalConditionFunc(blackboard: any): boolean;
}
//# sourceMappingURL=Cond.d.ts.map