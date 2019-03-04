import Plugin from 'sran.nvim';
export declare class Clock {
    private plugin;
    private flash$;
    private flashSubscription;
    private width;
    private bufnr;
    private winnr;
    private buffer;
    private timer;
    private logger;
    constructor(plugin: Plugin);
    init(): Promise<void>;
    enable(): Promise<void>;
    close(): Promise<void>;
    destroy(): void;
    private flash;
    private updateClock;
    private updateTime;
    private createBuffer;
    private createWin;
}
