import {BTreeAttribute, BTreeGuardFn} from "./BTreeAttribute";

export default class Cond extends BTreeAttribute {
    constructor(public conditionFunc: BTreeGuardFn) {
        super();
    }

    // isGuard = () => true;
    getDetails() {
        return {executionFunc: this.conditionFunc?.name || 'anonymous', type: this.getType()};
    }

    evalConditionFunc(blackboard) : boolean {
        return Boolean(this.conditionFunc(blackboard));
    }

    // isSatisfied = (blackboard): boolean => {
    //     return this.conditionFunc(blackboard) === true
    // };
}
