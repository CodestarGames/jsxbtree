import { BTreeAttribute, BTreeCallbackFn } from "../Decorators/BTreeAttribute";
export default class Step extends BTreeAttribute {
    executionFunc: BTreeCallbackFn;
    constructor(executionFunc: BTreeCallbackFn);
    getDetails(): {
        executionFunc: string;
        type: string;
    };
    callExecutionFunc(blackboard: any): void;
}
//# sourceMappingURL=Step.d.ts.map