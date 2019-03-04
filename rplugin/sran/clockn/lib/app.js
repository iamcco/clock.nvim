"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var fronts_1 = require("./fronts");
function align(num) {
    return ("" + num).replace(/^(\d)$/, '0$1');
}
var Clock = /** @class */ (function () {
    function Clock(plugin) {
        this.plugin = plugin;
        this.flash$ = new rxjs_1.Subject();
        this.init();
    }
    Clock.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, nvim, util, _b;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.plugin, nvim = _a.nvim, util = _a.util;
                        this.logger = util.getLogger('clock.nvim');
                        _b = this;
                        return [4 /*yield*/, nvim.getOption('columns')];
                    case 1:
                        _b.width = (_c.sent());
                        this.flashSubscription = this.flash$.pipe(operators_1.filter(function () { return _this.timer !== undefined; }), operators_1.mergeMap(function () {
                            return rxjs_1.from(_this.flash()).pipe(operators_1.catchError(function (error) {
                                return rxjs_1.of(error);
                            }));
                        })).subscribe(function (error) {
                            if (error) {
                                _this.logger.error('Flash Error: ', error);
                            }
                        });
                        nvim.on('notification', function (method) {
                            switch (method) {
                                case 'clockn-disable':
                                    _this.close();
                                    break;
                                case 'clockn-enable':
                                    _this.enable();
                                    break;
                                case 'clockn-flash':
                                    _this.flash$.next(Date.now());
                                    break;
                                default:
                                    break;
                            }
                        });
                        nvim.on('request', function (method, args, resp) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = method;
                                        switch (_a) {
                                            case 'clockn-disable': return [3 /*break*/, 1];
                                            case 'clockn-enable': return [3 /*break*/, 3];
                                        }
                                        return [3 /*break*/, 5];
                                    case 1: return [4 /*yield*/, this.close()];
                                    case 2:
                                        _b.sent();
                                        resp.send();
                                        return [3 /*break*/, 6];
                                    case 3: return [4 /*yield*/, this.enable()];
                                    case 4:
                                        _b.sent();
                                        resp.send();
                                        return [3 /*break*/, 6];
                                    case 5: return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
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
                        if (!(this.timer !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.createBuffer()];
                    case 3:
                        buffer = _a.sent();
                        this.buffer = buffer;
                        buffer.setOption('buftype', 'nofile');
                        buffer.setOption('modifiable', false);
                        return [4 /*yield*/, this.createWin(this.bufnr)];
                    case 4:
                        win = _a.sent();
                        return [4 /*yield*/, win.setOption('number', false)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, win.setOption('relativenumber', false)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, win.setOption('cursorline', false)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, win.setOption('cursorcolumn', false)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, win.setOption('conceallevel', 2)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, win.setOption('signcolumn', 'no')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.updateClock()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.close = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearTimeout(this.timer);
                        return [4 /*yield*/, this.plugin.nvim.call('clockn#close_win', this.winnr)];
                    case 1:
                        _a.sent();
                        this.timer = undefined;
                        this.buffer = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.destroy = function () {
        this.close();
        this.flashSubscription.unsubscribe();
    };
    Clock.prototype.flash = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nvim, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.timer === undefined) {
                            return [2 /*return*/];
                        }
                        nvim = this.plugin.nvim;
                        _a = this;
                        return [4 /*yield*/, nvim.getOption('columns')];
                    case 1:
                        _a.width = (_b.sent());
                        return [4 /*yield*/, nvim.call('nvim_win_config', [
                                this.winnr,
                                -1,
                                -1,
                                {
                                    relative: 'editor',
                                    anchor: 'NE',
                                    focusable: false,
                                    row: 1,
                                    col: this.width
                                }
                            ])];
                    case 2:
                        _b.sent();
                        nvim.command('mode');
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.updateClock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                        this.timer = setTimeout(function () {
                            _this.updateClock();
                        }, 1000);
                        return [4 /*yield*/, this.updateTime()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Clock.prototype.updateTime = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var now, hours, minutes, seconds, lines, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        now = new Date();
                        hours = align(now.getHours());
                        minutes = align(now.getMinutes());
                        seconds = align(now.getSeconds());
                        lines = fronts_1.fronts[hours[0]]
                            .map(function (item, idx) {
                            var hour = "" + item.join('') + fronts_1.fronts[hours[1]][idx].join('');
                            var separator = fronts_1.fronts['separator'][idx].join('');
                            var minute = "" + fronts_1.fronts[minutes[0]][idx].join('') + fronts_1.fronts[minutes[1]][idx].join('');
                            var second = "" + fronts_1.fronts[seconds[0]][idx].join('') + fronts_1.fronts[seconds[1]][idx].join('');
                            return ("" + hour + separator + minute + separator + second).trimRight();
                        });
                        _a = this.buffer;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.buffer.setOption('modifiable', true)];
                    case 1:
                        _a = (_d.sent());
                        _d.label = 2;
                    case 2:
                        _a;
                        _b = this.buffer;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.buffer.replace(lines, 0)];
                    case 3:
                        _b = (_d.sent());
                        _d.label = 4;
                    case 4:
                        _b;
                        _c = this.buffer;
                        if (!_c) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.buffer.setOption('modifiable', false)];
                    case 5:
                        _c = (_d.sent());
                        _d.label = 6;
                    case 6:
                        _c;
                        return [2 /*return*/];
                }
            });
        });
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
