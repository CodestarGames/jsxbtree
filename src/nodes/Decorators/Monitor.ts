import {BTreeAttribute, BTreeMonitor} from "./BTreeAttribute";

export default class Monitor extends BTreeAttribute {
    private readonly conditionFunc: (blackboard?) => boolean;
    constructor(props: BTreeMonitor) {
        super();
        this.conditionFunc = props.fn;
    }

    // isGuard = () => true;
    getDetails() {
        return {executionFunc: this.conditionFunc?.name || 'anonymous', type: this.getType()};
    }

    evalConditionFunc(blackboard): boolean {
        return Boolean(this.conditionFunc(blackboard));
    }

    // isSatisfied = (blackboard): boolean => {
    //     return this.conditionFunc(blackboard) === true
    // };
}
