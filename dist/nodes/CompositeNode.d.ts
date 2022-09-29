import { IDecoratorsFromJSXProps, Node } from "./Node";
export declare abstract class CompositeNode extends Node {
    props: any;
    constructor(props: any);
    key: string;
    abstract onUpdate(): any;
    abort(): void;
    reset(): void;
    isLeafNode: () => boolean;
}
export interface ICompositeNodeParams extends IDecoratorsFromJSXProps {
    parentUid?: any;
    children?: any;
    blackboard?: any;
}
//# sourceMappingURL=CompositeNode.d.ts.map