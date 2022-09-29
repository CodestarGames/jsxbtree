import { BTreeAttribute, BTreeCallbackFn } from "../Decorators/BTreeAttribute";
export default class Entry extends BTreeAttribute {
    executionFunc: BTreeCallbackFn;
    constructor(executionFunc: BTreeCallbackFn);
    getDetails(): {
        executionFunc: string;
        type: string;
    };
    callExecutionFunc(blackboard: any): void;
}
//# sourceMappingURL=Entry.d.ts.map