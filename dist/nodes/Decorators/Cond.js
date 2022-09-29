import { BTreeAttribute } from "./BTreeAttribute";
export default class Cond extends BTreeAttribute {
    conditionFunc;
    constructor(conditionFunc) {
        super();
        this.conditionFunc = conditionFunc;
    }
    // isGuard = () => true;
    getDetails() {
        return { executionFunc: this.conditionFunc?.name || 'anonymous', type: this.getType() };
    }
    evalConditionFunc(blackboard) {
        return Boolean(this.conditionFunc(blackboard));
    }
}
//# sourceMappingURL=Cond.js.map