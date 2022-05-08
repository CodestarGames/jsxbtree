import {IDecoratorsFromJSXProps, Node} from "./Node";
import {NodeState} from "../NodeState";
import Exit from "./Decorators/CallBacks/Exit";

export abstract class CompositeNode extends Node {
    constructor(public props) {
        super(props);
    }

    abstract onUpdate();

    abort() {
        // There is nothing to do if this node is not in the running state.
        if (!this.is(NodeState.RUNNING)) {
            return;
        }

        // Abort any child 
        this.children.forEach((child: Node) => child.abort());

        // Reset the state of this node.
        this.reset();

        // Try to get the exitState decorator for this node.
        const exitDecorator: Exit = this.getCallback<Exit>("exit");

        // Call the exitState decorator function if it exists.
        if (exitDecorator) {
            exitDecorator.callExecutionFunc(this.blackboard);
        }
    }

    reset() {
        // Reset the state of this node.
        this.setState(NodeState.READY);

        // Reset the state of any child 
        this.children.forEach(child => child.reset());
    }

    isLeafNode = () => false;

}


export interface ICompositeNodeParams extends IDecoratorsFromJSXProps {
     parentUid?;
     children?;
     blackboard?;
}
