export interface TimerObj {
    id : number;
    func : (...params) => void;
    interval : number;
    loop : number;
    forever : boolean;
    params : Array<any>;
    count : number;
    finished : boolean;
    call_time : number;
}


export class Timer {
    private static _instance : Timer;

    private _key_index : number;
    private _key_pool : Array<number>;
    private _calls : {[key : number] : TimerObj};
    private _time_func : () => number;
    private constructor() {
        this._key_index = 0;
        this._key_pool = new Array<number>();
        this._calls = {};
        this._time_func = () => {
            return new Date().getTime();
        }
    }

    static getInstance() : Timer {
        if (!this._instance) {
            this._instance = new Timer();
        }

        return this._instance;
    }

    addTimer(func : (...params) => void, interval? : number, loop? : number, params? : Array<any>) : number {
        if (!func) return -1;
        if (!interval) interval = 1000;
        if (!loop) loop = 1;
        let forever : boolean = loop == -1;
        if (!params) params = new Array<any>();

        let new_key : number;
        if (this._key_pool.length > 0xff00)  {
            new_key = this._key_pool.shift();
        }
        else {
            this._key_index += 1;
            new_key = this._key_index;
        }

        let obj : TimerObj = {
            id : new_key,
            func : func,
            interval : interval,
            loop : loop,
            forever : forever,
            params : params,
            count : 0,
            finished : false,
            call_time : this._time_func()
        }
        params[params.length] = obj;
        this._calls[new_key] = obj;

        return new_key;
    }

    update(dt : number) : void {
        let now : number = this._time_func();
        let del_calls : Array<number>;

        for(let key in this._calls) {
            let v : TimerObj = this._calls[key];
            let diff_time : number = now - v.call_time;
            if (diff_time > 0) {
                let exec_times = Math.ceil(diff_time / v.interval);
                if (!v.forever) {
                    exec_times = exec_times > v.loop ? v.loop : exec_times;
                    v.loop -= exec_times;
                }
                v.count += exec_times;
                if (v.forever || v.loop > 0) {
                    v.call_time = now + v.interval;
                }
                else {
                    if (!del_calls) {
                        del_calls = new Array<number>();
                    }
                    del_calls.push(v.id);
                    v.finished = true;
                }
                v.func(...v.params);
            }
        }

        if (del_calls) {
            for(let id of del_calls) {
                this.removeTimer(id);
            }
        }
    }

    removeTimer(id : number) : void {
        if (this._calls[id]) {
            this._key_pool.push(id);
            delete this._calls[id];
        }
    }

    clear() : void {
        this._key_index = 0;
        this._key_pool = new Array<number>();
        this._calls = {};
    }
}
