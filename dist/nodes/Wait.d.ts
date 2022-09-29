import { LeafNode } from "./LeafNode";
import { IBaseActionProps } from "../index";
export declare class WaitNode extends LeafNode {
    props: IWaitParams;
    private initialUpdateTime;
    private duration;
    constructor(props: IWaitParams);
    onUpdate(): void;
    getCaption(): string;
    type: string;
}
export interface IWaitParams extends IBaseActionProps {
    duration: number | ((bb: any) => number);
}
//# sourceMappingURL=Wait.d.ts.map