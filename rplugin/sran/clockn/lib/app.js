"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fronts_1 = require("./fronts");
function align(num) {
    return ("" + num).replace(/^(\d)$/, '0$1');
}
var Clock = /** @class */ (function () {
    function Clock(plugin) {
        this.plugin = plugin;
        this.init();
    }
    Clock.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nvim, isEnable, _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nvim = this.plugin.nvim;
                        return [4 /*yield*/, nvim.getVar('clockn_enable')];
                    case 1:
                        isEnable = _b.sent();
                        _a = this;
                        return [4 /*yield*/, nvim.call('winwidth', 0)];
                    case 2:
                        _a.width = _b.sent();
                        nvim.on('notification', function (method) {
                            if (method === 'clockn-disable') {
                                _this.close();
                            }
                            else if (method === 'clockn-enable') {
                                _this.enable();
                            }
                        });
                        if (isEnable) {
                            this.enable();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.enable = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buffer, win;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.timer !== undefined) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.createBuffer()];
                    case 1:
                        buffer = _a.sent();
                        this.buffer = buffer;
                        buffer.setOption('buftype', 'nofile');
                        return [4 /*yield*/, this.createWin(this.bufnr)];
                    case 2:
                        win = _a.sent();
                        win.setOption('number', false);
                        win.setOption('relativenumber', false);
                        win.setOption('cursorline', false);
                        win.setOption('cursorcolumn', false);
                        win.setOption('conceallevel', 2);
                        win.setOption('signcolumn', 'no');
                        this.updateClock();
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.close = function () {
        clearTimeout(this.timer);
        this.plugin.nvim.call('clockn#close_win', this.winnr);
        this.timer = undefined;
        this.buffer = undefined;
    };
    Clock.prototype.updateClock = function () {
        var _this = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(function () {
            _this.updateClock();
        }, 1000);
        this.updateTime();
    };
    Clock.prototype.updateTime = function () {
        var now = new Date();
        var hours = align(now.getHours());
        var minutes = align(now.getMinutes());
        var seconds = align(now.getSeconds());
        var lines = fronts_1.fronts[hours[0]]
            .map(function (item, idx) {
            var hour = "" + item.join('') + fronts_1.fronts[hours[1]][idx].join('');
            var separator = fronts_1.fronts['separator'][idx].join('');
            var minute = "" + fronts_1.fronts[minutes[0]][idx].join('') + fronts_1.fronts[minutes[1]][idx].join('');
            var second = "" + fronts_1.fronts[seconds[0]][idx].join('') + fronts_1.fronts[seconds[1]][idx].join('');
            return ("" + hour + separator + minute + separator + second).trimRight();
        });
        this.buffer.replace(lines, 0);
    };
    Clock.prototype.createBuffer = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nvim, buffer, _a, buffers;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nvim = this.plugin.nvim;
                        _a = this;
                        return [4 /*yield*/, nvim.call('nvim_create_buf', [0, 1])];
                    case 1:
                        _a.bufnr = _b.sent();
                        return [4 /*yield*/, nvim.buffers];
                    case 2:
                        buffers = _b.sent();
                        buffers.some(function (b) {
                            if (_this.bufnr === b.id) {
                                buffer = b;
                                return true;
                            }
                            return false;
                        });
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    Clock.prototype.createWin = function (bufnr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nvim, _a, win, windows;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nvim = this.plugin.nvim;
                        _a = this;
                        return [4 /*yield*/, nvim.call('nvim_open_win', [
                                bufnr,
                                false,
                                54,
                                5,
                                {
                                    relative: 'editor',
                                    anchor: 'NE',
                                    focusable: false,
                                    row: 1,
                                    col: this.width
                                }
                            ])];
                    case 1:
                        _a.winnr = _b.sent();
                        return [4 /*yield*/, nvim.windows];
                    case 2:
                        windows = _b.sent();
                        windows.some(function (w) {
                            if (w.id === _this.winnr) {
                                win = w;
                                return true;
                            }
                            return false;
                        });
                        return [2 /*return*/, win];
                }
            });
        });
    };
    return Clock;
}());
exports.Clock = Clock;
