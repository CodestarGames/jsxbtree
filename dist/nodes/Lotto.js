import { CompositeNode } from "./CompositeNode";
import { NodeState } from "../NodeState";
export class LottoNode extends CompositeNode {
    constructor() {
        super(...arguments);
        this.type = 'lotto';
    }
    reset() {
        super.reset();
        this.winningChild = null;
    }
    onUpdate() {
        if (this.is(NodeState.READY) || !this.winningChild) {
            this.winningChild = this.children[Math.floor(Math.random() * this.children.length)];
        }
        // If the winning child has never been updated or is running then we will need to updateState it now.
        if (this.winningChild.is(NodeState.READY) || this.winningChild.is(NodeState.RUNNING)) {
            this.winningChild.update();
        }
        // The state of the Lotto node is the state of its winning child.
        this.setState(this.winningChild.state);
    }
    getCaption() {
        return "LOTTO";
    }
}
//# sourceMappingURL=Lotto.js.map