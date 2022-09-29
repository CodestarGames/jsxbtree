import { BTreeAttribute } from "./BTreeAttribute";
export default class AlwaysFail extends BTreeAttribute {
    constructor(succeed) {
        super();
    }
    // isGuard = () => true;
    getDetails() {
        return { type: this.getType() };
    }
}
//# sourceMappingURL=AlwaysFail.js.map