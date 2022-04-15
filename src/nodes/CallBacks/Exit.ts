import {BTreeAttribute, BTreeCallbackFn} from "../Decorators/BTreeAttribute";

export default class Exit extends BTreeAttribute {
    constructor(public executionFunc: BTreeCallbackFn) {
        super();
    }

    getDetails() {
        return {executionFunc: this.executionFunc?.name || 'anonymous', type: this.getType()};
    }

    callExecutionFunc(blackboard) {
        this.executionFunc(blackboard);
    }
}
