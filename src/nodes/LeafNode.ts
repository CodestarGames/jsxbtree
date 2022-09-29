import {Node} from "./Node";

export abstract class LeafNode extends Node {
    key: string;
    constructor(public props) {
        super(props);
    }

    abstract onUpdate(): void;

    isLeafNode = () => true;

}
