import {BTreeCallbackFn, Decorator} from "../Decorator";

export default class Step extends Decorator {
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
