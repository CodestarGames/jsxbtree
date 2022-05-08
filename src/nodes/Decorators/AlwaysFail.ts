import {Decorator} from "./Decorator";

export default class AlwaysFail extends Decorator {

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
