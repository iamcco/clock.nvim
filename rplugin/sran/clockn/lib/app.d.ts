import Plugin from 'sran.nvim';
export declare class Clock {
    private plugin;
    private width;
    private bufnr;
    private winnr;
    private buffer;
    private timer;
    constructor(plugin: Plugin);
    init(): Promise<void>;
    enable(): Promise<void>;
    close(): void;
    flash(): Promise<void>;
    private updateClock;
    private updateTime;
    private createBuffer;
    private createWin;
}
