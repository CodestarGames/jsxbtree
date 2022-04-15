declare namespace BTree {
    
    type Node = {
        uid: string;
        children: any[];
        update();
    }
    
    interface IWaitParams extends IBaseCmdProps{
        duration: number;
    }
    
        
    type BTreeCallbackFn = (blackboard?) => void
    
    type BTreeGuardFn = (blackboard?) => boolean
    
    interface IDecoratorsFromJSXProps {

        while?: BTreeGuardFn;
        until?: BTreeGuardFn;
        entry?: BTreeCallbackFn;
        step?: BTreeCallbackFn;
        exit?: BTreeCallbackFn;
        cond?: BTreeGuardFn;
        alwaysSucceed: any;
        alwaysFail: any;

    }
    
        
    interface IBaseActionProps extends IDecoratorsFromJSXProps {
        parentUid?,
        conditions?: any
        blackboard?: any
    }
    
    interface IFunctionCallProps extends IBaseActionProps {
        fn: BTreeCallbackFn
    }

    

}

declare namespace JSX {
    // The return type of our JSX Factory: this could be anything
    type Element = BTree.Node;

    // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
    interface IntrinsicElements {
        wait: BTree.IWaitParams
        functionCall: IFunctionCallProps
        parallel: IBaseActionProps
        condition: {}
        lotto: {}
        selector: IBaseActionProps
        sequence: IBaseActionProps
        repeat: {}
    }
    
    type Tag = keyof JSX.IntrinsicElements

    interface Component {
        (properties?: { [key: string]: any }, children?: BTree.Node[]): BTree.Node
    }
    
}
