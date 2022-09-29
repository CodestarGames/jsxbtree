import { BTreeAttribute } from "./BTreeAttribute";
export default class AlwaysSucceed extends BTreeAttribute {
    constructor(succeed) {
        super();
    }
    // isGuard = () => true;
    getDetails() {
        return { type: this.getType() };
    }
}
//# sourceMappingURL=AlwaysSucceed.js.map