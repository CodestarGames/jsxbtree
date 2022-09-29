import { Node } from "./Node";
export class LeafNode extends Node {
    props;
    key;
    constructor(props) {
        super(props);
        this.props = props;
    }
    isLeafNode = () => true;
}
//# sourceMappingURL=LeafNode.js.map