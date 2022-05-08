import {Decorator, BTreeGuardFn} from "./Decorator";
import {Stops} from "../../Stops";

export default class BlackboardCondition extends Decorator {
    constructor(public conditionFunc: BTreeGuardFn, Stops: Stops) {
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
