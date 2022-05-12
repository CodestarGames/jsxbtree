import {CompositeNode} from "./CompositeNode";
import {NodeState} from "../NodeState";

/**
 * @classdesc Active selectors execute all child guards and only succeed one that doesn't fail.
 */
export class ActiveSelectorNode extends CompositeNode {

    onUpdate() {
        let foundChildToUpdate = null;
        let errored = false;
        for (let i = 0; i < this.children.length; i++) {

            errored = false;
            const child = this.children[i];
            try {
                child.guardPath.evaluate(this.blackboard);
            }
            catch(error) {
                // If the error is a GuardUnsatisfiedException then we need to determine if this node is the source.
                if (error.constructor.name === 'GuardUnsatisifedException' && error.isSourceNode(child)) {
                    errored = true;
                    child.abort();
                } else {
                    throw error;
                }
            }
            finally {
                if(errored === false) {
                    foundChildToUpdate = child;
                }
            }

            if(foundChildToUpdate)
                break;
        }

        if(foundChildToUpdate)
            foundChildToUpdate.update();

        this.setState(foundChildToUpdate ? foundChildToUpdate.state : NodeState.FAILED)



    }

    getCaption(): string {
        return "ACTIVESELECTOR";
    }

    type = 'activeSelector'
}
