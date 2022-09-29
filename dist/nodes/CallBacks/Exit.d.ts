import { BTreeAttribute, BTreeCallbackFn } from "../Decorators/BTreeAttribute";
export default class Exit extends BTreeAttribute {
    executionFunc: BTreeCallbackFn;
    constructor(executionFunc: BTreeCallbackFn);
    getDetails(): {
        executionFunc: string;
        type: string;
    };
    callExecutionFunc(blackboard: any): void;
}
//# sourceMappingURL=Exit.d.ts.map