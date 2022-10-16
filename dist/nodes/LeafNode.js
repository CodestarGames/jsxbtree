import { Node } from "./Node";
export class LeafNode extends Node {
    constructor(props) {
        super(props);
        this.props = props;
        this.isLeafNode = () => true;
    }
}
//# sourceMappingURL=LeafNode.js.map