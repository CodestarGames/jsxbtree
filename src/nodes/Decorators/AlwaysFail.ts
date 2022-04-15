import {BTreeAttribute} from "./BTreeAttribute";

export default class AlwaysFail extends BTreeAttribute {

    constructor(succeed: boolean) {
        super();
    }

    // isGuard = () => true;
    getDetails() {
        return {type: this.getType()};
    }

    // isSatisfied = (blackboard): boolean => {
    //     return this.conditionFunc(blackboard) === true
    // };
}
