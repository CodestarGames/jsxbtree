import {Node} from "./nodes/Node";

export function cloneChildren(children: Node | Node[], props: any) {
    let list: Node[] = [];
    if(Array.isArray(children) === false)
        list.push(children as Node);
    else
        list = children as Node[];

    return list.map((child: Node) => {
        return child && Object.assign(child, Object.assign({
            parentUid: props.parentUid
        }));
    });

}
