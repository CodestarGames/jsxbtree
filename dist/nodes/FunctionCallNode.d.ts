import { LeafNode } from "./LeafNode";
import { BTreeCallbackFn } from "./Decorators/BTreeAttribute";
import { IDecoratorsFromJSXProps } from "./Node";
export declare class FunctionCallNode extends LeafNode {
    readonly props: IFunctionCallProps;
    constructor(props: IFunctionCallProps);
    onUpdate(): void;
    getCaption(): string;
    type: string;
}
export interface IFunctionCallProps extends IDecoratorsFromJSXProps {
    parentUid?: any;
    fn: BTreeCallbackFn;
}
//# sourceMappingURL=FunctionCallNode.d.ts.map