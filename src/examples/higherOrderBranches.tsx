import jsx, {cloneChildren, IBaseActionProps, Sequence} from '../'
import {ActionConsoleLog} from "./ActionConsoleLog";
import {Node} from "../nodes/Node";
import {BTreeManager} from "../BTreeManager";


function TestTree (props) {
    return (
        <GameplaySequenceTemplate {...props}>
            {{
                introSlot: <ActionConsoleLog txt={'do intro'}/>,
                gamePlaySlot: <ActionConsoleLog txt={'do gameplay'}/>,
                outroSlot: <ActionConsoleLog txt={'do outro'}/>
            }}
        </GameplaySequenceTemplate>
    )
}

function processSlot(slot: any | (() => any)) {
    return typeof slot === 'function' ? slot() : slot;
}
interface IGameLoopSlots extends IBaseActionProps {
    children: {
        introSlot?: Node | (() => Node)
        gamePlaySlot?: Node | (() => Node)
        outroSlot?: Node | (() => Node)
    }
}
function GameplaySequenceTemplate(props: IGameLoopSlots) {

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

const main = () => {

    let blackboard = {
        message: 'foo'
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
