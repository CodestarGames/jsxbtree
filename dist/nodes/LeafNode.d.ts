import { Node } from "./Node";
export declare abstract class LeafNode extends Node {
    props: any;
    key: string;
    constructor(props: any);
    abstract onUpdate(): void;
    isLeafNode: () => boolean;
}
//# sourceMappingURL=LeafNode.d.ts.map