import {CompositeNode} from "./CompositeNode";
import {NodeState} from "../NodeState";

/**
 * @classdesc Active selectors execute all child guards and only succeed one that doesn't fail.
 */
export class ActiveSelectorNode extends CompositeNode {

    onUpdate() {
        let guardUnsatisfiedCount = 0;
        let foundChildToUpdate = null;
        for (let i = 0; i < this.children.length; i++){
            if(guardUnsatisfiedCount !== i) {
                //we've found our one to updateState.
                foundChildToUpdate = this.children[i-1];
                break;
            }
            const child = this.children[i];
            try {
                child.guardPath.evaluate(this.blackboard);
            }
            catch(error) {
                // If the error is a GuardUnsatisfiedException then we need to determine if this node is the source.
                if (error.constructor.name === 'GuardUnsatisifedException' && error.isSourceNode(child)) {
                    guardUnsatisfiedCount++
                    child.abort();
                } else {
                    throw error;
                }
            }
        }
        if(foundChildToUpdate)
            foundChildToUpdate.update();

        this.setState(guardUnsatisfiedCount === this.children.length ? NodeState.FAILED : NodeState.SUCCEEDED)



    }

    getCaption(): string {
        return "ACTIVESELECTOR";
    }

    type = 'activeSelector'
}
