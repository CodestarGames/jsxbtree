import {GuardPath, GuardUnsatisifedException} from "./Guards/GuardUnsatisifedException";
import {BTreeAttribute, BTreeCallbackFn, BTreeGuardFn} from "./Decorators/BTreeAttribute";
import While from "./Guards/While";
import Until from "./Guards/Until";
import Cond from "./Decorators/Cond";
import AlwaysSucceed from "./Decorators/AlwaysSucceed";
import AlwaysFail from "./Decorators/AlwaysFail";
import Entry from "./CallBacks/Entry";
import Step from "./CallBacks/Step";
import Exit from "./CallBacks/Exit";
import {NodeState} from "../nodeState";

export interface IDecoratorsFromJSXProps {

        while?: BTreeGuardFn;
        until?: BTreeGuardFn;
        entry?: BTreeCallbackFn;
        step?: BTreeCallbackFn;
        exit?: BTreeCallbackFn;
        cond?: BTreeGuardFn;
        alwaysSucceed?: any;
        alwaysFail?: any;

}

export interface INode {
    children: any[];
}

export abstract class Node implements INode {
    uid: string;
    blackboard: any;
    branchName: string;

    protected constructor(public props : any  = {}) {

        /**
         * The node state.
         */
        this.state = NodeState.READY;
        /**
         * The guard path to evaluate as part of a node update.
         */
        this.guardPath = null;

        this.uid = createNodeUid();

        this.blackboard = props?.blackboard && props.blackboard;
        this.branchName = props?.branchName && props?.branchName;
    }

    getStateAsString() {
        const convertNodeStateToString = (state) => {
            switch (state) {
                case NodeState.RUNNING:
                    return "running";
                case NodeState.SUCCEEDED:
                    return "succeeded";
                case NodeState.FAILED:
                    return "failed";
                default:
                    return "ready";
            }
        };

        return convertNodeStateToString(this.state);
    }


    get guardPath(): GuardPath {
        return this._guardPath;
    }

    set guardPath(value: GuardPath) {
        this._guardPath = value;
    }

    _decorators: BTreeAttribute[] = [];
    _guardPath: GuardPath;

    get decorators(): BTreeAttribute[] {
        return this._decorators;
    }

    set decorators(value: BTreeAttribute[]) {
        this._decorators = value;
    }


    getDecorator<T>(type): T {
        return (this.decorators.find((decorator) => decorator.getType().toUpperCase() === type.toUpperCase()) as unknown as T);
    }

    _children?: any[] = [];
    get children(): any[] {
        return this._children;
    }

    set children(value: any[]) {
        this._children = value;
    }

    state: NodeState;

    is(value: NodeState) {
        return this.state === value;
    }

    setState(val: NodeState) {
        this.state = val;
    }

    reset() {
        // Reset the state of this node.
        this.setState(NodeState.READY);
    }

    getGuardDecorators() {
        return this.decorators.filter((decorator) => decorator.isGuard());
    }

    abstract isLeafNode

    hasGuardPath() {
        return !!this.guardPath;
    }

    update(): void {
        // If this node is already in a 'SUCCEEDED' or 'FAILED' state then there is nothing to do.
        if (this.is(NodeState.SUCCEEDED) || this.is(NodeState.FAILED)) {
            // We have not changed NodeState.
            return;
        }

        try {
            if (!this.guardPath) {
                throw new Error("No guard path detected!");
            }

            // Evaluate all of the guard path conditions for the current tree path.
            this.guardPath.evaluate(this.blackboard);

            // If this node is in the READY NodeState then call the ENTRY decorator for this node if it exists.
            if (this.is(NodeState.READY)) {
                const entryDecorator: Entry = this.getDecorator<Entry>("entry");

                // Call the entry decorator function if it exists.
                if (entryDecorator) {
                    entryDecorator.callExecutionFunc(this.blackboard);
                }
            }

            // Try to get the step decorator for this node.
            const stepDecorator: Step = this.getDecorator<Step>("step");

            // Call the step decorator function if it exists.
            if (stepDecorator) {
                stepDecorator.callExecutionFunc(this.blackboard);
            }

            // Try to call the condition decorator, exit out if failed
            if (this.is(NodeState.READY)) {
                const condDecorator: Cond = this.getDecorator<Cond>("cond");

                // Call the cond decorator function if it exists.
                if (condDecorator) {
                    let condRes = condDecorator.evalConditionFunc(this.blackboard);
                    if (condRes === false) {
                        this.setState(NodeState.FAILED);
                        return;
                    }
                }
            }


            // Do the actual update.
            this.onUpdate();

            // The state of this node will depend in the state of its child.

            //if we have an auto-succeed decorator, then just succeed the node
            const alwaysSucceedDecorator: AlwaysSucceed = this.getDecorator<AlwaysSucceed>("alwaysSucceed");
            const alwaysFailDecorator: AlwaysFail = this.getDecorator<AlwaysFail>("alwaysFail");
            if(alwaysSucceedDecorator) {
                this.handleAlwaysSucceed();
            }

            if(alwaysFailDecorator) {
                this.handleAlwaysFail();
            }



            // If this node is now in a 'SUCCEEDED' or 'FAILED' NodeState then call the EXIT decorator for this node if it exists.
            if (this.is(NodeState.SUCCEEDED) || this.is(NodeState.FAILED)) {
                const exitDecorator: Exit = this.getDecorator<Exit>("exit");

                // Call the exit decorator function if it exists.
                if (exitDecorator) {
                    exitDecorator.callExecutionFunc(this.blackboard);
                }
            }
        } catch (error) {
            // If the error is a GuardUnsatisfiedException then we need to determine if this node is the source.
            if (error instanceof GuardUnsatisifedException && error.isSourceNode(this)) {
                // Abort the current node.
                this.abort();

                // Any node that is the source of an abort will be a failed node.
                this.setState(NodeState.FAILED);
            } else {
                throw error;
            }
        }
    }

    abort() {
        // There is nothing to do if this node is not in the running state.
        if (!this.is(NodeState.RUNNING)) {
            return;
        }

        // Reset the state of this node.
        this.reset();

        // Try to get the exit decorator for this node.
        const exitDecorator: Exit = this.getDecorator<Exit>("exit");

        // Call the exit decorator function if it exists.
        if (exitDecorator) {
            exitDecorator.callExecutionFunc(this.blackboard);
        }
    }

    abstract onUpdate(): void;

    abstract getCaption(): string;

    abstract type: string

    private handleAlwaysSucceed() {
        switch (this.state) {
            case NodeState.RUNNING:
                this.setState(NodeState.RUNNING);
                break;

            case NodeState.SUCCEEDED:
            case NodeState.FAILED:
                this.setState(NodeState.SUCCEEDED);
                break;

            default:
                this.setState(NodeState.READY);
        }
    }

    private handleAlwaysFail() {
        switch (this.state) {
            case NodeState.RUNNING:
                this.setState(NodeState.RUNNING);
                break;

            case NodeState.SUCCEEDED:
            case NodeState.FAILED:
                this.setState(NodeState.FAILED);
                break;

            default:
                this.setState(NodeState.READY);
        }
    }
}

export function createDecoratorsFromProps(props: IDecoratorsFromJSXProps): BTreeAttribute[] {
    let decoratorsList : BTreeAttribute[] = [];
    for (let propsKey in props) {
        switch(propsKey) {
            case 'while':
                decoratorsList.push(new While(props[propsKey]))
                break;
            case 'until':
                decoratorsList.push(new Until(props[propsKey]))
                break;
            case 'entry':
                decoratorsList.push(new Entry(props[propsKey]))
                break;
            case 'step':
                decoratorsList.push(new Step(props[propsKey]))
                break;
            case 'exit':
                decoratorsList.push(new Exit(props[propsKey]))
                break;
            case 'cond':
                decoratorsList.push(new Cond(props[propsKey]))
                break;
            case 'alwaysSucceed':
                decoratorsList.push(new AlwaysSucceed(props[propsKey]))
                break;
            case 'alwaysFail':
                decoratorsList.push(new AlwaysFail(props[propsKey]))
                break;
        }
    }
    return decoratorsList;
}

/**
 * Create a randomly generated node uid.
 * @returns A randomly generated node uid.
 */
function createNodeUid() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
