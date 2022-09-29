export interface TimerObj {
    id: number;
    func: (...params: any[]) => void;
    interval: number;
    loop: number;
    forever: boolean;
    params: Array<any>;
    count: number;
    finished: boolean;
    call_time: number;
}
export declare class Timer {
    private static _instance;
    private _key_index;
    private _key_pool;
    private _calls;
    private _time_func;
    private constructor();
    static getInstance(): Timer;
    addTimer(func: (...params: any[]) => void, interval?: number, loop?: number, params?: Array<any>): number;
    update(dt: number): void;
    removeTimer(id: number): void;
    clear(): void;
}
//# sourceMappingURL=Timer.d.ts.map