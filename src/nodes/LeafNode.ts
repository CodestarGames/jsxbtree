import {Node} from "./Node";

export abstract class LeafNode extends Node {
    constructor(public props) {
        super(props);
    }

    abstract onUpdate(): void;

    isLeafNode = () => true;

}
