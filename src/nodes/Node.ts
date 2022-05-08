
import {Decorator, BTreeCallbackFn, BTreeGuardFn} from "./Decorators/Decorator";
import BlackboardCondition from "./Decorators/BlackboardCondition";
import AlwaysSucceed from "./Decorators/AlwaysSucceed";
import AlwaysFail from "./Decorators/AlwaysFail";
import {NodeState} from "../NodeState";
import {GuardPath} from "./Decorators/Guards/GuardUnsatisifedException";
import Entry from "./Decorators/CallBacks/Entry";
import Step from "./Decorators/CallBacks/Step";
import Exit from "./Decorators/CallBacks/Exit";
import While from "./Decorators/Guards/While";
import Until from "./Decorators/Guards/Until";

export interface IDecoratorsFromJSXProps {
    decorators?: Decorator[] | Decorator;
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
         * The guard path to evaluate as part of a node updateState.
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

    _decorators: Decorator[] = [];
    _guardPath: GuardPath;

    get decorators(): Decorator[] {
        return this._decorators;
    }

    set decorators(value) {
        if(Array.isArray(value))
            this._decorators = value;
        else
            this._decorators = [value];
    }


    getCallback<T>(type): T {
        return (this.decorators.find((decorator) => decorator.getType().toUpperCase() === type.toUpperCase()) as unknown as T);
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
                const entryDecorator: Entry = this.getCallback<Entry>("entry");

                // Call the entry decorator function if it exists.
                if (entryDecorator) {
                    entryDecorator.callExecutionFunc(this.blackboard);
                }
            }

            // Try to get the step decorator for this node.
            const stepDecorator: Step = this.getCallback<Step>("step");

            // Call the step decorator function if it exists.
            if (stepDecorator) {
                stepDecorator.callExecutionFunc(this.blackboard);
            }

            // Try to call the Condition decorator, exitState out if failed
            if (this.is(NodeState.READY)) {
                const condDecorator: BlackboardCondition = this.getCallback<BlackboardCondition>("cond");

                // Call the cond decorator function if it exists.
                if (condDecorator) {
                    let condRes = condDecorator.evalConditionFunc(this.blackboard);
                    if (condRes === false) {
                        this.setState(NodeState.FAILED);
                        return;
                    }
                }
            }


            // Do the actual updateState.
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
                const exitDecorator: Exit = this.getCallback<Exit>("exit");

                // Call the exitState decorator function if it exists.
                if (exitDecorator) {
                    exitDecorator.callExecutionFunc(this.blackboard);
                }
            }
        } catch (error) {
            // If the error is a GuardUnsatisfiedException then we need to determine if this node is the source.
            if (error.constructor.name === 'GuardUnsatisifedException' && error.isSourceNode(this)) {
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

        // Try to get the exitState decorator for this node.
        const exitDecorator: Exit = this.getCallback<Exit>("exit");

        // Call the exitState decorator function if it exists.
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
