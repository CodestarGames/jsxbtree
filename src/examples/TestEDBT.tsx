import jsx, {FunctionCall, Lotto, Parallel, Repeat, Selector, Sequence, Wait, Service, BlackboardCondition, WaitUntilStopped, Stops } from '../'
import ActionConsoleLog from "./ActionConsoleLog";

export function TestEDBT(props) {

    let {
       foo
    } = props.blackboard;


    return (
        <Selector decorators={
            new Service(500, (bb) => bb.foo = !bb.foo)
        }>
            <Sequence decorators={
                new BlackboardCondition((bb) => bb.foo === true, Stops.IMMEDIATE_RESTART)
            }>
                <ActionConsoleLog txt={'foo'}/>
                <WaitUntilStopped/>
            </Sequence>
            <Sequence>
                <ActionConsoleLog txt={'bar'}/>
                <WaitUntilStopped/>
            </Sequence>
        </Selector>
    )
}
