# jsxbtree


A tool to declaratively define and generate behaviour trees in JS/TS. Behaviour trees are used to create complex AI via the modular heirarchical composition of individual tasks.

Using this library, trees can be defined with JSX as a DSL, avoiding the need to write verbose definitions in JSON.

![image](https://user-images.githubusercontent.com/5861090/188404926-f7cceb4b-264d-49f1-a81a-5f9a33a87746.png)

## Install

```sh
$ npm install --save jsxbtree
```

# Example
```typescript jsx
import jsx, {FunctionCall, Lotto, Parallel, Repeat, Selector, Sequence, Wait, BTreeManager } from '../'

const TestTree = (props) => (
    <Selector {...props}>
        <Sequence while={(blackboard) => blackboard.timeout < 5000} >
            <Wait duration={1000}/>
            <FunctionCall fn={(bb) => { bb.timeout += 1000; }}/>
        </Sequence>
        <TestBranch/>
    </Selector>
);


function TestBranch(props) {
    return (
        <Sequence {...props}>
            <Wait duration={1000}/>
            <Selector>
                <Sequence alwaysFail={true}>
                    <ActionConsoleLog txt={'test succeed/fail decorator'}/>
                </Sequence>
                <ActionConsoleLog txt={'we failed!'}/>
            </Selector>
            <Repeat iterations={2}>
                <Parallel>
                    <ActionConsoleLog txt={'called in parallel 1'}/>
                    <ActionConsoleLog txt={'called in parallel 2'}/>
                </Parallel>
            </Repeat>
            <Lotto>
                <ActionConsoleLog txt={'rand choice in lotto 1'}/>
                <ActionConsoleLog txt={'rand choice in lotto 2'}/>
            </Lotto>
        </Sequence>
    )
}

const main = () => {

    let blackboard = {
        message: 'hello from the blackboard!'
    };

    let treeManager = BTreeManager.getInstance();

    let lastTime;
    function gameLoop(time) {
        if (lastTime != null) {
            const dt = time - lastTime
            BTreeManager.getInstance().update(dt);
        }
        lastTime = time
        window.requestAnimationFrame(gameLoop)
    }
    window.requestAnimationFrame(gameLoop)
    treeManager.start(TestTree, 60, blackboard);

}

main();

```

# Nodes

## States
Behaviour tree nodes can be in one of the following states:
- **READY** A node is in a ready state when it has not been visited yet in the execution of the tree.
- **RUNNING** A node is in a running state when it is is still being processed, these nodes will usually represent or encompass a long running action.
- **SUCCEEDED** A node is in a succeeded state when it is no longer being processed and has succeeded.
- **FAILED** A node is in a failed state when it is no longer being processed but has failed.


## Composite Nodes
Composite nodes wrap one or more child nodes, each of which will be processed in a sequence determined by the type of the composite node. A composite node will remain in the running state until it is finished processing the child nodes, after which the state of the composite node will reflect the success or failure of the child nodes.

### Sequence
This composite node will update each child node in sequence. It will succeed if all of its children have succeeded and will fail if any of its children fail. This node will remain in the running state if one of its children is running.

```

const TestTree = (props) => (
    <Sequence {...props}>
        <FunctionCall fn={() => { console.log("test 1") }}/>
        <FunctionCall fn={() => { console.log("test 2") }}/>
        <FunctionCall fn={() => { console.log("test 3") }}/>
    </Sequence>
);
```

### Selector
This composite node will update each child node in sequence. It will fail if all of its children have failed and will succeed if any of its children succeed. This node will remain in the running state if one of its children is running.

```
const TestTree = (props) => (
    <Selector {...props}>
        <SomeAction />
        <SomeAction />
        <SomeAction />
    </Selector>
);
```

### Parallel
This composite node will update each child node concurrently. It will succeed if all of its children have succeeded and will fail if any of its children fail. This node will remain in the running state if any of its children are running.

```
const TestTree = (props) => (
    <Parallel {...props}>
        <SomeAction />
        <SomeAction />
    </Parallel>
);
```

### Lotto
This composite node will select a single child at random to run as the active running node. The state of this node will reflect the state of the active child.

```
const TestTree = (props) => (
    <Lotto {...props}>
        <SomeAction />
        <SomeAction />
        <SomeAction />
    </Lotto>
);
```

## Decorator Nodes
A decorator node is similar to a composite node, but it can only have a single child node. The state of a decorator node is usually some transformation of the state of the child node. Decorator nodes are also used to repeat or terminate execution of a particular node.


### AlwaysSucceed
This decorator node will move to the succeed state when its child moves to the either the failed state or the succeeded state. This node will remain in the running state if its child is in the running state.

```
const TestTree = (props) => (
    <Sequence {...props}>
        <SomeAction alwaysSucceed={true} />
    </Sequence>
);
```

### AlwaysFail
This decorator node will move to the failed state when its child moves to the either the failed state or the succeeded state. This node will remain in the running state if its child is in the running state.

```
const TestTree = (props) => (
    <Sequence {...props}>
        <SomeAction alwaysFail={true} />
    </Sequence>
);
```

## Leaf Nodes
Leaf nodes are the lowest level node type and cannot be the parent of other child nodes.

### Action
An action node represents an action that can be completed immediately as part of a single tree step, or ongoing behaviour that can take a prolonged amount of time and may take multiple tree steps to complete. Each action node will correspond to functionality defined within the blackboard, where the first action node argument will be an identifier matching the name of the corresponding blackboard action function.

A blackboard action function can optionally return a finished action state of **succeeded** or **failed**. If the **succeeded** or **failed** state is returned, then the action will move into that state.

```
const TestTree = (props) => (
    <Sequence {...props}>
        <FunctionCall fn={(bb) => bb.Attack() }/>
    </Sequence>
);
```

```js
const board = {
    //...
    Attack: () => {
        // If we do not have a weapon then we cannot attack.
        if (!this.isHoldingWeapon()) {
            // We have failed to carry out an attack!
            return NodeState.FAILED;
        }

        // ... Attack with swiftness and precision ...

        // We have carried out our attack.
        return NodeState.SUCCEEDED;
    }
    // ...
};
```

If no value is returned from the action function the action node will move into the **running** state and no following nodes will be processed as part of the current tree step. In the example below, any action node that references **WalkToPosition** will remain in the **running** state until the target position is reached.

```js
const board = {
    //...
    WalkToPosition: () => {
        // ... Walk towards the position we are trying to reach ...

        // Check whether we have finally reached the target position.
        if (this.isAtTargetPosition()) {
            // We have finally reached the target position!
            return NodeState.SUCCEEDED;
        }
    }
    // ...
};
```

Further steps of the tree will resume processing from leaf nodes that were left in the **running** state until they succeed, fail, or processing of the running branch is aborted via a guard.

### Condition
A Condition node will immediately move into either a **succeeded** or **failed** based of the boolean result of calling a function in the blackboard. Each condition node will correspond to functionality defined within the blackboard, where the first condition node argument will be an identifier matching the name of the corresponding blackboard condition function.

```
const TestTree = (props) => (
    <Sequence {...props}>
        <Condition eq={(bb) => bb.HasWeapon} />
        <FunctionCall fn={(bb) => bb.attackPlayer() }/>
    </Sequence>
);
```
```js
const board = {
    //...
    HasWeapon: () => this.isHoldingWeapon(),
    //...
    Attack: () => this.attackPlayer(),
    // ...
};
```

### Wait
A wait node will remain in a running state for a specified duration, after which it will move into the succeeded state. The duration in milliseconds can be defined as a single integer node argument.
```
const TestTree = (props) => (
    <Sequence {...props}>
        <Wait duration={2000} />
        <SomeAction />
    </Sequence>
);
```
In the above example, we are using a wait node to wait 2 seconds between each run of the **FireWeapon** action.


### Branch
Named branch nodes can be referenced by passing a named functional component with the branched code inside. This is a great way to encapsulate large tree portions.

```
const TestTree = (props) => (
    <Sequence {...props}>
        <SomeAction txt={'foo'} />
        <MyBranch />
    </Sequence>
);

const MyBranch = (props) => (
    <Sequence {...props}>
        <Wait duration={2000} />
        <SomeAction txt={'bar'} />
    </Sequence>
);



```

## Callbacks
Callbacks can be defined for tree nodes and will be invoked as the node is processed during a tree step. Any number of callbacks can be attached to a node as long as there are not multiple callbacks of the same type.

Optional arguments can be defined for callback functions in the same way as action and condition functions.

### Entry
An entry callback defines a function to call whenever the associated node moves out of the **ready** state when it is first visited.

```
const TestTree = (props) => (
    <Sequence {...props} entry={(bb) => bb.startWalkingAnim() }>
        <FunctionCall fn={(bb) => bb.walkEast() }/>
        <FunctionCall fn={(bb) => bb.walkNorth() }/>
        <FunctionCall fn={(bb) => bb.walkWest() }/>
        <FunctionCall fn={(bb) => bb.walkSouth() }/>
    </Sequence>
);
```

### Exit
An exit callback defines a function to call whenever the associated node moves to a finished state or is aborted. A results object is passed to the referenced function containing the **succeeded** and **aborted** boolean properties.

```

const TestTree = (props) => (
    <Sequence {...props} 
            entry={(bb) => bb.startWalkingAnim()} 
            exit={(bb) => bb.stopWalkingAnim()}
        >
        <FunctionCall fn={(bb) => bb.walkEast() }/>
        <FunctionCall fn={(bb) => bb.walkNorth() }/>
        <FunctionCall fn={(bb) => bb.walkWest() }/>
        <FunctionCall fn={(bb) => bb.walkSouth() }/>
    </Sequence>
);
```

### Step
A step callback defines a function to call whenever the associated node is updated as part of a tree step.

```

const TestTree = (props) => (
    <Sequence {...props} step={(bb) => bb.onMoving() }>
        <FunctionCall fn={(bb) => bb.walkEast() }/>
        <FunctionCall fn={(bb) => bb.walkNorth() }/>
        <FunctionCall fn={(bb) => bb.walkWest() }/>
        <FunctionCall fn={(bb) => bb.walkSouth() }/>
    </Sequence>
);
```

### Guards
A guard defines a condition that must be met in order for the node to remain active. Any running nodes will have their guard condition evaluated for each leaf node update, and will move to a failed state if the guard condition is not met.

This functionality is useful as a means of aborting long running actions or branches that span across multiple steps of the tree.

```

const TestTree = (props) => (
    <Wait {...props} while={(bb) => bb.canWait() } />
);
```

In the above example, we have a **wait** node that waits for 10 seconds before moving to a succeeded state. We are using a **while** guard to give up on waiting this long if the condition **CanWait** evaluates to false during a tree step.

#### While
A while guard will be satisfied as long as its condition evaluates to true.

```

const TestTree = (props) => (
    <Sequence {...props} while={(bb) => bb.isWandering() }>
        <FunctionCall fn={(bb) => bb.whistle() }/>
        <Wait duration={5000}/>
        <FunctionCall fn={(bb) => bb.yawn() }/>
        <Wait duration={5000}/>
    </Sequence>
);

```

#### Until
An until guard will be satisfied as long as its condition evaluates to false.

```
const TestTree = (props) => (
    <Sequence {...props} until={(bb) => bb.canSeePlayer() }>
        <FunctionCall fn={(bb) => bb.lookLeft() }/>
        <Wait duration={5000}/>
        <FunctionCall fn={(bb) => bb.lookRight() }/>
        <Wait duration={5000}/>
    </Sequence>
);
```

#### Higher order (slotted ) branches
Used for making control flow code where nodes can be inserted into "slots" in a higher order component.
The following example shows how this can be used when making a typical gameplay loop.
```

function TestTree (props) {
    return (
        <GameplaySequenceTemplate {...props}>
            {{
                introSlot: <ActionConsoleLog txt={'do intro'}/>,
                gamePlaySlot: (
                    <Sequence>
                        <ActionConsoleLog txt={'jump'}/>
                        <ActionConsoleLog txt={'fight'}/>
                        <ActionConsoleLog txt={'win'}/>
                    </Sequence>
                ),
                outroSlot: <ActionConsoleLog txt={'do outro'}/>
            }}
        </GameplaySequenceTemplate>
    )
}




function GameplaySequenceTemplate(props) {

    const processSlot = (slot: any | (() => any)) => {
        return typeof slot === 'function' ? slot() : slot;
    }
    
    let {introSlot, gamePlaySlot, outroSlot} = props.children[0];
    let _is = processSlot(introSlot);
    let _gps = processSlot(gamePlaySlot);
    let _os = processSlot(outroSlot);

    return (
        <Sequence {...props}>
            { _is && cloneChildren(_is, Object.assign({}, props))[0] }
            { _gps && cloneChildren(_gps, Object.assign({}, props))[0] }
            { _os && cloneChildren(_os, Object.assign({}, props))[0] }
        </Sequence>
    )

}
```

