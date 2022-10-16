import { BTreeAttribute } from "../Decorators/BTreeAttribute";
export default class Step extends BTreeAttribute {
    constructor(executionFunc) {
        super();
        this.executionFunc = executionFunc;
    }
    getDetails() {
        return { executionFunc: this.executionFunc?.name || 'anonymous', type: this.getType() };
    }
    callExecutionFunc(blackboard) {
        this.executionFunc(blackboard);
    }
}
//# sourceMappingURL=Step.js.map