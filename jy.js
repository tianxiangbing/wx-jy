/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/adpater.ts":
/*!************************!*\
  !*** ./src/adpater.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 对h5和wx进行兼容处理
 */
__webpack_require__(/*! ./weapp-adapter */ "./src/weapp-adapter.js");
let iswx = false;
if (!window || window.hasOwnProperty('wx')) {
    iswx = true;
}
let isMobile = true;
if (navigator.userAgent.indexOf('Mobile') == -1) {
    isMobile = false;
}
let events = {};
const adapter = {
    // showShareMenu: () => { },
    createCanvas: () => {
        if (iswx) {
            return window['canvas']; //全局创建的canvas
        }
        else {
            let canvas = document.createElement('canvas');
            canvas.height = document.documentElement.clientHeight;
            canvas.width = document.documentElement.clientWidth;
            canvas.style.position = 'absolute';
            canvas.style.top = "0";
            canvas.style.left = "0";
            document.body.append(canvas);
            return canvas;
        }
    },
    eventMap: {
        touchstart: 'click',
        touchmove: 'mousemove'
    },
    wrapEventType(type) {
        if (isMobile) {
            return type;
        }
        else {
            return this.eventMap[type] || type;
        }
    },
    addEventListener(target, type, listener) {
        // console.log(777)
        if (iswx) {
            target.addEventListener(type, listener);
        }
        else {
            type = this.wrapEventType(type);
            if (!events[type]) {
                events[type] = [];
                target.addEventListener(type, this.handle.call(this, type), false);
            }
            events[type].push(listener);
        }
    },
    handle(type) {
        return (event) => {
            let listeners = events[type];
            console.log(3333, listeners);
            for (var i = 0; i < listeners.length; i++) {
                if (!isMobile) {
                    event.touches = [event];
                }
                listeners[i](event);
            }
        };
    },
    removeEventListener(target, type, listener) {
        if (iswx) {
            target.removeEventListener(type, listener);
        }
        else {
            type = this.wrapEventType(type);
            var listeners = events[type];
            if (listeners && listeners.length > 0) {
                for (var i = listeners.length; i--; i > 0) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
            if (listeners == 0 || !listener) {
                console.log(4444);
                events[type] = [];
                // target.removeEventListener(type, this.handle(type), false);
            }
        }
    },
    dispatchEvent(target, event) {
        if (iswx) {
            target.dispatchEvent(event);
        }
        else {
            let type = event.type;
            var listeners = events[type];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](event);
                }
            }
        }
    }
    // createImage() {
    //     let img = new Image();
    //     return img;
    // },
    // createInnerAudioContext() {
    //     let audio = new Audio();
    //     let f = null;
    //     let newProps = {
    //         onCanplay(t) {
    //             f = t;
    //         }
    //     }
    //     audio.oncanplay = (e) => {
    //         f();
    //     }
    //     return Object.assign(audio, newProps)
    // }
};
exports.default = adapter;


/***/ }),

/***/ "./src/control.ts":
/*!************************!*\
  !*** ./src/control.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//操作界面
class Control {
    constructor() {
        this.rect = [160, 160];
        this.moveRect = [50, 50];
        this.elemPosition = [10, 10];
        this.angle = 0; //角度
    }
    create() {
        this.elem = document.createElement('div');
        this.elem.className = "control";
        this.elem.style.position = 'absolute';
        this.elem.style.width = this.rect[0] + 'px';
        this.elem.style.height = this.rect[1] + 'px';
        this.elem.style.left = this.elemPosition[0] + '%';
        this.elem.style.bottom = this.elemPosition[1] + '%';
        this.moveElem = document.createElement('div');
        this.moveElem.className = 'move';
        this.moveElem.style.position = 'absolute';
        this.moveElem.style.width = this.moveRect[0] + 'px';
        this.moveElem.style.height = this.moveRect[1] + 'px';
        this.elem.appendChild(this.moveElem);
        this.moveCenter = this.moveRect.map(function (d) { return d / 2; });
        this.elemCenter = this.rect.map(function (d) { return d / 2; });
        this.resetPos();
        this.bindEvent();
        return this.elem;
    }
    resetPos() {
        //重置位置
        // console.log(this.moveCenter)
        this.toPosition = [0, 0];
        this.transPosition();
    }
    //传入圆心转换成坐标,
    transPosition() {
        let x = (this.elemCenter[0] - this.moveCenter[0]) + this.toPosition[0];
        let y = (this.elemCenter[1] - this.moveCenter[1]) - this.toPosition[1];
        this.moveElem.style.left = x + 'px';
        this.moveElem.style.top = y + 'px';
    }
    bindEvent() {
        this.elem.addEventListener('touchstart', function (event) {
            let epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchmove', function (event) {
            let epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchend', function (event) {
            this.resetPos();
        }.bind(this), false);
    }
    // 计算边界值,设置位置
    setPosition(epos) {
        this.position = [this.elem.offsetLeft, this.elem.offsetTop];
        let x = epos.pageX - this.position[0];
        let y = epos.pageY - this.position[1];
        // x= Math.min (x,this.rect[0]-this.moveCenter[0]);
        // x = Math.max(x,this.moveCenter[0])
        let x1 = (x - this.elemCenter[0]); //相对于圆点的位置
        let y1 = -(y - this.elemCenter[1]);
        console.log(x1, y1);
        let ang = Math.atan2(y1, x1);
        // this.angle = ang;
        // console.log('角度：'+ang)
        let c = Math.sqrt(x1 * x1 + y1 * y1);
        let r = this.elemCenter[0] - this.moveCenter[0]; //最长半径
        if (c > r) {
            // console.log('out', c)
            let x2 = Math.cos(ang) * r;
            let y2 = Math.sin(ang) * r;
            //下面是另一种算法
            // y2=y1*r/c;
            // x2= x1*r/c;
            // console.log('xy:', x1, y1)
            // console.log('x2y2:',x2, y2)
            x1 = x2;
            y1 = y2;
        }
        this.toPosition = [x1, y1];
        this.transPosition();
    }
    getAngle() {
        // console.log(this.toPosition)
        this.angle = Math.atan2(this.toPosition[1], this.toPosition[0]);
        return this.angle;
    }
    //获取到角度
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}
exports.default = Control;


/***/ }),

/***/ "./src/descript.ts":
/*!*************************!*\
  !*** ./src/descript.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//描述设计
class Descript {
    constructor(stage) {
        this.stage = stage;
        console.log(arguments);
    }
    create(resolve) {
        this.stage.canvas.addEventListener('touchstart', () => {
            console.log('touch...');
            // this.stage.canvas.removeEventListener('touchstart');
            resolve();
        });
    }
    remove() {
        this.stage.clear();
    }
}
exports.default = Descript;


/***/ }),

/***/ "./src/gameOver.ts":
/*!*************************!*\
  !*** ./src/gameOver.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GameOver {
    constructor(btntitle) {
        this.btntitle = btntitle;
    }
    create(callback, text = '') {
        this.elem = document.createElement('div');
        this.elem.className = 'gameOver';
        this.textElem = document.createElement('div');
        this.textElem.className = 'text';
        this.textElem.innerHTML = text;
        this.elem.appendChild(this.textElem);
        let btn = document.createElement('button');
        btn.className = "button";
        btn.innerText = this.btntitle;
        btn.addEventListener('touchstart', function (event) {
            callback.call(this);
        }.bind(this), false);
        // btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    }
    setText(text = '') {
        this.textElem.innerHTML = text;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}
exports.default = GameOver;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jy_1 = __webpack_require__(/*! ./jy */ "./src/jy.ts");
exports.JY = jy_1.default;
exports.STATE = jy_1.STATE;
const control_1 = __webpack_require__(/*! ./control */ "./src/control.ts");
exports.Control = control_1.default;
const descript_1 = __webpack_require__(/*! ./descript */ "./src/descript.ts");
exports.Descript = descript_1.default;
const gameOver_1 = __webpack_require__(/*! ./gameOver */ "./src/gameOver.ts");
exports.GameOver = gameOver_1.default;
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
exports.Sprite = sprite_1.default;
const stage_1 = __webpack_require__(/*! ./stage */ "./src/stage.ts");
exports.Stage = stage_1.default;
const title_1 = __webpack_require__(/*! ./title */ "./src/title.ts");
exports.Title = title_1.default;
const lib_1 = __webpack_require__(/*! ../src/lib */ "./src/lib.ts");
exports.lib = lib_1.default;


/***/ }),

/***/ "./src/jy.ts":
/*!*******************!*\
  !*** ./src/jy.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
/// <reference path="sprite.ts" />
/// <reference path="title.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
/// <reference path="control.ts" />
*/
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
const lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
__webpack_require__(/*! ./adpater */ "./src/adpater.ts");
//游戏主框架
var STATE;
(function (STATE) {
    STATE[STATE["loading"] = 0] = "loading";
    STATE[STATE["title"] = 1] = "title";
    STATE[STATE["descript"] = 2] = "descript";
    STATE[STATE["newGame"] = 3] = "newGame";
    STATE[STATE["running"] = 4] = "running";
    STATE[STATE["gameOver"] = 5] = "gameOver";
})(STATE = exports.STATE || (exports.STATE = {}));
class JY {
    constructor(stage, titleStage, descriptStage, gameOverStage, controlStage) {
        this.stage = stage;
        this.titleStage = titleStage;
        this.descriptStage = descriptStage;
        this.gameOverStage = gameOverStage;
        this.controlStage = controlStage;
        this.func = new Function;
        this.ispause = false; //是否处于暂停状态
        this.interval = 10;
        this.resources = [];
        this.context = stage.context;
        // this.setup();
    }
    setup() {
        this.stage.draw();
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
        this.loop();
    }
    // 实现游戏帧循环
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ispause) {
                yield this.func();
            }
            this.aniId = requestAnimationFrame(this.loop.bind(this));
        });
    }
    createControl() {
    }
    //新的开始
    newGame() {
        //游戏开始，清空场景
        //打开计时器
        this.setState(STATE.running);
    }
    //结束 
    over() {
        this.setState(STATE.gameOver);
    }
    //暂停
    pause() {
        this.ispause = true;
        window.cancelAnimationFrame(this.aniId);
    }
    //暂停后的继续
    play() {
        this.ispause = false;
        this.loop();
    }
    //游戏结束
    gameOver() {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        this.stage.clear();
        this.showGameOver();
    }
    //结束画面
    showGameOver() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('game  over...');
            yield lib_1.default.waitMoment(3000);
        });
    }
    //游戏中的
    running() {
        console.log('running...');
    }
    loading() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading....');
            yield this.showLoading();
            console.log('loading end...');
            this.setState(STATE.title);
        });
    }
    showLoading() {
        lib_1.default.write(this.stage, '正在加载中');
        return lib_1.default.loadResources(this.resources);
    }
    title() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('title....');
            yield this.showTitle();
            this.setState(STATE.descript);
        });
    }
    showTitle() {
        // this.titleStage.create()
        // return lib.waitMoment(3000);
        return new Promise(resolve => {
            this.titleStage.create(resolve);
        });
    }
    descript() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('descript...');
            yield this.showDescript();
            this.setState(STATE.newGame);
        });
    }
    showDescript() {
        return new Promise(resolve => {
            this.descriptStage.create(resolve);
        });
        // return lib.waitMoment(3000);
    }
    proxy(stageFunc) {
        this.stage.clear();
        return stageFunc.bind(this);
    }
    //检查状态
    checkState() {
        switch (this.currentState) {
            case STATE.loading:
                this.func = this.proxy(this.loading);
                break;
            case STATE.title:
                this.func = this.proxy(this.title);
                break;
            case STATE.descript:
                this.func = this.proxy(this.descript);
                break;
            case STATE.newGame:
                this.func = this.proxy(this.newGame);
                break;
            case STATE.running:
                this.func = this.proxy(this.running);
                break;
            case STATE.gameOver:
                this.func = this.proxy(this.gameOver);
            default:
                break;
        }
    }
    setState(state) {
        this.currentState = state;
        this.checkState();
        // this.func();
    }
    //碰撞检测
    hits(oA, oB) {
        var bx = false, by = false;
        if (oA.type == sprite_1.SHAPE.rect) {
            var bw = oB.width;
            var aw = oA.width;
            var bh = oB.height;
            var ah = oA.height;
            if (oA.x > oB.x) {
                bx = oA.x - oB.x < bw;
            }
            else if (oA.x < oB.x) {
                bx = oB.x - oA.x < aw;
            }
            else {
                bx = true;
            }
            ;
            if (oA.y > oB.y) {
                by = oA.y - oB.y < bh;
            }
            else if (oA.y < oB.y) {
                by = oB.y - oA.y < ah;
            }
            else {
                by = true;
            }
            ;
            return (bx && by);
        }
        else if (oA.type == sprite_1.SHAPE.circle) {
            var r2 = oA.r + oB.r;
            let oAc = oA.getCenter();
            let oBc = oB.getCenter();
            bx = Math.abs(oAc[0] - oBc[0]) < r2;
            by = Math.abs(oAc[1] - oBc[1]) < r2;
            return (bx && by);
        }
    }
}
exports.default = JY;


/***/ }),

/***/ "./src/lib.ts":
/*!********************!*\
  !*** ./src/lib.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const adpater_1 = __webpack_require__(/*! ./adpater */ "./src/adpater.ts");
const lib = {
    //暂停一段时间
    waitMoment(second) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let t = setTimeout(() => {
                    clearTimeout(t);
                    resolve();
                }, second);
            });
        });
    },
    //显示文字
    write(stage, text, x, y, font = "20px Arial", fillStyle = '#000000', w = stage.width) {
        let context = stage.context;
        context.font = font;
        context.fillStyle = fillStyle;
        if (x == undefined) {
            x = (stage.width - text.length * 14) / 2;
        }
        if (y == undefined) {
            y = stage.height / 2 - 15;
        }
        // console.log(text)
        var chr = String(text).split("");
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
            if (context.measureText(temp).width < w && context.measureText(temp + (chr[a])).width <= w) {
                temp += chr[a];
            } //context.measureText(text).width  测量文本text的宽度
            else {
                row.push(temp);
                temp = chr[a];
            }
        }
        row.push(temp);
        for (var b = 0; b < row.length; b++) {
            context.fillText(row[b], x, y + (b + 1) * 24); //字体20，间隔24。类似行高
        }
    },
    //导入图片
    draw(stage, img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight) {
        let context = stage.context;
        // let image = wx.createImage();
        let image = this.caches[img];
        let args = Array.prototype.slice.call(arguments, 2);
        args.unshift(image);
        // console.log('draw', img)
        // image.onload = ()=>{
        //     context.drawImage.call(context,...args);
        // } 
        // image.src = img;
        context.drawImage.call(context, ...args);
    },
    //取区间数的随机值
    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    caches: {},
    loadResources(files) {
        // let cache = {};
        let arr = [];
        return new Promise((resolve, reject) => {
            for (let k in files) {
                if (/\.(jpg|gif|png|bmg|jpeg)/.test(files[k])) {
                    //图片的预加载
                    arr.push(new Promise(resolve => {
                        let image = new Image();
                        image.onload = () => {
                            this.caches[files[k]] = image;
                            resolve();
                        };
                        image.src = files[k];
                    }));
                }
                else if (/\.(mp3|wav|avi|m4a|aac)/.test(files[k])) {
                    //音频
                    arr.push(new Promise(resolve => {
                        let audio = new Audio();
                        audio.addEventListener('canplay', () => {
                            this.caches[files[k]] = audio;
                            resolve();
                        });
                        audio.src = files[k];
                        // console.log(2222)
                    }));
                }
            }
            return Promise.all(arr).catch((e) => {
                console.log('加载资源出错.');
                reject(e);
            }).then(() => {
                console.log('加载资源完成.');
                resolve();
            });
        });
    },
    play(url) {
        //播放声音
        let audio = this.caches[url];
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    },
    createCanvas() {
        return adpater_1.default.createCanvas();
    },
    addEventListener(target, type, handle) {
        return adpater_1.default.addEventListener(target, type, handle);
    },
    removeEventListener(target, type, handle) {
        return adpater_1.default.removeEventListener(target, type, handle);
    },
    dispatchEvent(target, type) {
        return adpater_1.default.dispatchEvent(target, type);
    }
};
let events = ['createCanvas', 'addEventListener', 'removeEventListener', 'dispatchEvent'];
events.forEach(item => {
    lib[item] = adpater_1.default[item].bind(adpater_1.default);
});
exports.default = lib;


/***/ }),

/***/ "./src/sprite.ts":
/*!***********************!*\
  !*** ./src/sprite.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
//sprite
//形状
var SHAPE;
(function (SHAPE) {
    SHAPE[SHAPE["rect"] = 0] = "rect";
    SHAPE[SHAPE["circle"] = 1] = "circle";
    SHAPE[SHAPE["text"] = 2] = "text"; //文本
})(SHAPE = exports.SHAPE || (exports.SHAPE = {}));
/**
 * 游戏基础的精灵类
 */
class Sprite {
    constructor(stage, type = SHAPE.rect, content = '', width = 0, height = 0, x = 0, y = 0) {
        this.stage = stage;
        this.type = type;
        this.content = content;
        // type: SHAPE = SHAPE.rect;
        this.r = 0; //半径
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.visible = true;
    }
    /**
     * 将精灵图绘制在canvas上
     */
    draw() {
        if (!this.visible)
            return;
        if (this.type === SHAPE.text) {
            lib_1.default.write(this.stage, this.content.text, this.x, this.y, this.content.font, this.content.fillStyle);
        }
        else {
            lib_1.default.draw(this.stage, this.content, this.x, this.y, this.width, this.height);
        }
    }
    /**
     * 简单的碰撞检测定义：
     * 另一个精灵的中心点处于本精灵所在的矩形内即可
     * @param{Sprite} sp: Sptite的实例
     */
    hits(sp) {
        let spX = sp.x + sp.width / 2;
        let spY = sp.y + sp.height / 2;
        if (!this.visible || !sp.visible)
            return false;
        return !!(spX >= this.x
            && spX <= this.x + this.width
            && spY >= this.y
            && spY <= this.y + this.height);
    }
    touchHits(e, callback) {
        let touch = e.touches[0];
        if (this.hits({ x: touch.clientX, y: touch.clientY, width: 0, height: 0, visible: true })) {
            callback && callback.call(this);
        }
    }
    getCenter() {
        //圆心位置
        return [this.x + this.r, this.y + this.r];
    }
}
exports.default = Sprite;


/***/ }),

/***/ "./src/stage.ts":
/*!**********************!*\
  !*** ./src/stage.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Stage {
    constructor(canvas, width, height, style) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.style = style;
        this.context = canvas.getContext('2d');
    }
    draw(style) {
        this.context.fillStyle = this.style;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    //清空布景
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.draw();
    }
}
exports.default = Stage;


/***/ }),

/***/ "./src/title.ts":
/*!**********************!*\
  !*** ./src/title.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
class Title {
    constructor(title, stage) {
        this.title = title;
        this.stage = stage;
        // console.log(arguments)
    }
    create(resolve) {
        lib_1.default.write(this.stage, this.title);
        lib_1.default.waitMoment(3000);
        resolve();
    }
    remove() {
        this.stage.clear();
    }
}
exports.default = Title;


/***/ }),

/***/ "./src/weapp-adapter.js":
/*!******************************!*\
  !*** ./src/weapp-adapter.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {}

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		}

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true

/******/ 		// Return the exports of the module
/******/ 		return module.exports
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ""

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0)
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	if (!window['wx']) {
		return {};
	}
	var _window2 = __webpack_require__(1)

	var _window = _interopRequireWildcard(_window2)

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key] } } newObj.default = obj; return newObj } }

	var global = GameGlobal

	function inject() {
	  _window.addEventListener = _window.canvas.addEventListener = function (type, listener) {
	    _window.document.addEventListener(type, listener)
	  }
	  _window.removeEventListener = _window.canvas.removeEventListener = function (type, listener) {
	    _window.document.removeEventListener(type, listener)
	  }

	  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	      platform = _wx$getSystemInfoSync.platform

	  // 开发者工具无法重定义 window


	  if (typeof __devtoolssubcontext === 'undefined' && platform === 'devtools') {
	    for (var key in _window) {
	      var descriptor = Object.getOwnPropertyDescriptor(global, key)

	      if (!descriptor || descriptor.configurable === true) {
	        Object.defineProperty(window, key, {
	          value: _window[key]
	        })
	      }
	    }

	    for (var _key in _window.document) {
	      var _descriptor = Object.getOwnPropertyDescriptor(global.document, _key)

	      if (!_descriptor || _descriptor.configurable === true) {
	        Object.defineProperty(global.document, _key, {
	          value: _window.document[_key]
	        })
	      }
	    }
	    window.parent = window
	  } else {
	    for (var _key2 in _window) {
	      global[_key2] = _window[_key2]
	    }
	    global.window = _window
	    window = global
	    window.top = window.parent = window
	  }
	}

	if (!GameGlobal.__isAdapterInjected) {
	  GameGlobal.__isAdapterInjected = true
	  inject()
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'
	if (!window['wx']) {
		return {};
	}
	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	exports.cancelAnimationFrame = exports.requestAnimationFrame = exports.clearInterval = exports.clearTimeout = exports.setInterval = exports.setTimeout = exports.canvas = exports.location = exports.localStorage = exports.HTMLElement = exports.FileReader = exports.Audio = exports.Image = exports.WebSocket = exports.XMLHttpRequest = exports.navigator = exports.document = undefined

	var _WindowProperties = __webpack_require__(2)

	Object.keys(_WindowProperties).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _WindowProperties[key]
	    }
	  })
	})

	var _constructor = __webpack_require__(3)

	Object.keys(_constructor).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _constructor[key]
	    }
	  })
	})

	var _Canvas = __webpack_require__(9)

	var _Canvas2 = _interopRequireDefault(_Canvas)

	var _document2 = __webpack_require__(10)

	var _document3 = _interopRequireDefault(_document2)

	var _navigator2 = __webpack_require__(17)

	var _navigator3 = _interopRequireDefault(_navigator2)

	var _XMLHttpRequest2 = __webpack_require__(18)

	var _XMLHttpRequest3 = _interopRequireDefault(_XMLHttpRequest2)

	var _WebSocket2 = __webpack_require__(19)

	var _WebSocket3 = _interopRequireDefault(_WebSocket2)

	var _Image2 = __webpack_require__(11)

	var _Image3 = _interopRequireDefault(_Image2)

	var _Audio2 = __webpack_require__(12)

	var _Audio3 = _interopRequireDefault(_Audio2)

	var _FileReader2 = __webpack_require__(20)

	var _FileReader3 = _interopRequireDefault(_FileReader2)

	var _HTMLElement2 = __webpack_require__(4)

	var _HTMLElement3 = _interopRequireDefault(_HTMLElement2)

	var _localStorage2 = __webpack_require__(21)

	var _localStorage3 = _interopRequireDefault(_localStorage2)

	var _location2 = __webpack_require__(22)

	var _location3 = _interopRequireDefault(_location2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	exports.document = _document3.default
	exports.navigator = _navigator3.default
	exports.XMLHttpRequest = _XMLHttpRequest3.default
	exports.WebSocket = _WebSocket3.default
	exports.Image = _Image3.default
	exports.Audio = _Audio3.default
	exports.FileReader = _FileReader3.default
	exports.HTMLElement = _HTMLElement3.default
	exports.localStorage = _localStorage3.default
	exports.location = _location3.default


	// 暴露全局的 canvas
	var canvas = new _Canvas2.default()

	exports.canvas = canvas
	exports.setTimeout = setTimeout
	exports.setInterval = setInterval
	exports.clearTimeout = clearTimeout
	exports.clearInterval = clearInterval
	exports.requestAnimationFrame = requestAnimationFrame
	exports.cancelAnimationFrame = cancelAnimationFrame

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict"

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	    screenWidth = _wx$getSystemInfoSync.screenWidth,
	    screenHeight = _wx$getSystemInfoSync.screenHeight,
	    devicePixelRatio = _wx$getSystemInfoSync.devicePixelRatio

	var innerWidth = exports.innerWidth = screenWidth
	var innerHeight = exports.innerHeight = screenHeight
	exports.devicePixelRatio = devicePixelRatio
	var screen = exports.screen = {
	  availWidth: innerWidth,
	  availHeight: innerHeight
	}
	var performance = exports.performance = {
	  now: function now() {
	    return Date.now() / 1000
	  }
	}
	var ontouchstart = exports.ontouchstart = null
	var ontouchmove = exports.ontouchmove = null
	var ontouchend = exports.ontouchend = null

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	exports.HTMLCanvasElement = exports.HTMLImageElement = undefined

	var _HTMLElement3 = __webpack_require__(4)

	var _HTMLElement4 = _interopRequireDefault(_HTMLElement3)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var HTMLImageElement = exports.HTMLImageElement = function (_HTMLElement) {
	  _inherits(HTMLImageElement, _HTMLElement)

	  function HTMLImageElement() {
	    _classCallCheck(this, HTMLImageElement)

	    return _possibleConstructorReturn(this, (HTMLImageElement.__proto__ || Object.getPrototypeOf(HTMLImageElement)).call(this, 'img'))
	  }

	  return HTMLImageElement
	}(_HTMLElement4.default)

	var HTMLCanvasElement = exports.HTMLCanvasElement = function (_HTMLElement2) {
	  _inherits(HTMLCanvasElement, _HTMLElement2)

	  function HTMLCanvasElement() {
	    _classCallCheck(this, HTMLCanvasElement)

	    return _possibleConstructorReturn(this, (HTMLCanvasElement.__proto__ || Object.getPrototypeOf(HTMLCanvasElement)).call(this, 'canvas'))
	  }

	  return HTMLCanvasElement
	}(_HTMLElement4.default)

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	var _Element2 = __webpack_require__(5)

	var _Element3 = _interopRequireDefault(_Element2)

	var _util = __webpack_require__(8)

	var _WindowProperties = __webpack_require__(2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var HTMLElement = function (_Element) {
	  _inherits(HTMLElement, _Element)

	  function HTMLElement() {
	    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

	    _classCallCheck(this, HTMLElement)

	    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this))

	    _this.className = ''
	    _this.childern = []
	    _this.style = {
	      width: _WindowProperties.innerWidth + 'px',
	      height: _WindowProperties.innerHeight + 'px'
	    }
	    _this.insertBefore = _util.noop
	    _this.innerHTML = ''

	    _this.tagName = tagName.toUpperCase()
	    return _this
	  }

	  _createClass(HTMLElement, [{
	    key: 'setAttribute',
	    value: function setAttribute(name, value) {
	      this[name] = value
	    }
	  }, {
	    key: 'getAttribute',
	    value: function getAttribute(name) {
	      return this[name]
	    }
	  }, {
	    key: 'getBoundingClientRect',
	    value: function getBoundingClientRect() {
	      return {
	        top: 0,
	        left: 0,
	        width: _WindowProperties.innerWidth,
	        height: _WindowProperties.innerHeight
	      }
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {}
	  }, {
	    key: 'clientWidth',
	    get: function get() {
	      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length

	      return Number.isNaN(ret) ? 0 : ret
	    }
	  }, {
	    key: 'clientHeight',
	    get: function get() {
	      var ret = parseInt(this.style.fontSize, 10)

	      return Number.isNaN(ret) ? 0 : ret
	    }
	  }])

	  return HTMLElement
	}(_Element3.default)

	exports.default = HTMLElement

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _Node2 = __webpack_require__(6)

	var _Node3 = _interopRequireDefault(_Node2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var ELement = function (_Node) {
	  _inherits(ELement, _Node)

	  function ELement() {
	    _classCallCheck(this, ELement)

	    var _this = _possibleConstructorReturn(this, (ELement.__proto__ || Object.getPrototypeOf(ELement)).call(this))

	    _this.className = ''
	    _this.children = []
	    return _this
	  }

	  return ELement
	}(_Node3.default)

	exports.default = ELement

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	var _EventTarget2 = __webpack_require__(7)

	var _EventTarget3 = _interopRequireDefault(_EventTarget2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var Node = function (_EventTarget) {
	  _inherits(Node, _EventTarget)

	  function Node() {
	    _classCallCheck(this, Node)

	    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this))

	    _this.childNodes = []
	    return _this
	  }

	  _createClass(Node, [{
	    key: 'appendChild',
	    value: function appendChild(node) {
	      if (node instanceof Node) {
	        this.childNodes.push(node)
	      } else {
	        throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
	      }
	    }
	  }, {
	    key: 'cloneNode',
	    value: function cloneNode() {
	      var copyNode = Object.create(this)

	      Object.assign(copyNode, this)
	      return copyNode
	    }
	  }, {
	    key: 'removeChild',
	    value: function removeChild(node) {
	      var index = this.childNodes.findIndex(function (child) {
	        return child === node
	      })

	      if (index > -1) {
	        return this.childNodes.splice(index, 1)
	      }
	      return null
	    }
	  }])

	  return Node
	}(_EventTarget3.default)

	exports.default = Node

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	var _events = new WeakMap()

	var EventTarget = function () {
	  function EventTarget() {
	    _classCallCheck(this, EventTarget)

	    _events.set(this, {})
	  }

	  _createClass(EventTarget, [{
	    key: 'addEventListener',
	    value: function addEventListener(type, listener) {
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

	      var events = _events.get(this)

	      if (!events) {
	        events = {}
	        _events.set(this, events)
	      }
	      if (!events[type]) {
	        events[type] = []
	      }
	      events[type].push(listener)

	      if (options.capture) {
	        console.warn('EventTarget.addEventListener: options.capture is not implemented.')
	      }
	      if (options.once) {
	        console.warn('EventTarget.addEventListener: options.once is not implemented.')
	      }
	      if (options.passive) {
	        console.warn('EventTarget.addEventListener: options.passive is not implemented.')
	      }
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener(type, listener) {
	      var listeners = _events.get(this)[type]

	      if (listeners && listeners.length > 0) {
	        for (var i = listeners.length; i--; i > 0) {
	          if (listeners[i] === listener) {
	            listeners.splice(i, 1)
	            break
	          }
	        }
	      }
	    }
	  }, {
	    key: 'dispatchEvent',
	    value: function dispatchEvent() {
	      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

	      var listeners = _events.get(this)[event.type]

	      if (listeners) {
	        for (var i = 0; i < listeners.length; i++) {
	          listeners[i](event)
	        }
	      }
	    }
	  }])

	  return EventTarget
	}()

	exports.default = EventTarget

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict"

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	exports.noop = noop
	function noop() {}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	exports.default = Canvas

	var _constructor = __webpack_require__(3)

	var _HTMLElement = __webpack_require__(4)

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement)

	var _document = __webpack_require__(10)

	var _document2 = _interopRequireDefault(_document)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	var hasModifiedCanvasPrototype = false
	var hasInit2DContextConstructor = false
	var hasInitWebGLContextConstructor = false

	function Canvas() {
	  var canvas = wx.createCanvas()

	  canvas.type = 'canvas'

	  canvas.__proto__.__proto__ = new _HTMLElement2.default('canvas')

	  var _getContext = canvas.getContext

	  canvas.getBoundingClientRect = function () {
	    var ret = {
	      top: 0,
	      left: 0,
	      width: window.innerWidth,
	      height: window.innerHeight
	    }
	    return ret
	  }

	  return canvas
	}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _window = __webpack_require__(1)

	var window = _interopRequireWildcard(_window)

	var _HTMLElement = __webpack_require__(4)

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement)

	var _Image = __webpack_require__(11)

	var _Image2 = _interopRequireDefault(_Image)

	var _Audio = __webpack_require__(12)

	var _Audio2 = _interopRequireDefault(_Audio)

	var _Canvas = __webpack_require__(9)

	var _Canvas2 = _interopRequireDefault(_Canvas)

	__webpack_require__(15)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key] } } newObj.default = obj; return newObj } }

	var events = {}

	var document = {
	  readyState: 'complete',
	  visibilityState: 'visible',
	  documentElement: window,
	  hidden: false,
	  style: {},
	  location: window.location,
	  ontouchstart: null,
	  ontouchmove: null,
	  ontouchend: null,

	  head: new _HTMLElement2.default('head'),
	  body: new _HTMLElement2.default('body'),

	  createElement: function createElement(tagName) {
	    if (tagName === 'canvas') {
	      return new _Canvas2.default()
	    } else if (tagName === 'audio') {
	      return new _Audio2.default()
	    } else if (tagName === 'img') {
	      return new _Image2.default()
	    }

	    return new _HTMLElement2.default(tagName)
	  },
	  getElementById: function getElementById(id) {
	    if (id === window.canvas.id) {
	      return window.canvas
	    }
	    return null
	  },
	  getElementsByTagName: function getElementsByTagName(tagName) {
	    if (tagName === 'head') {
	      return [document.head]
	    } else if (tagName === 'body') {
	      return [document.body]
	    } else if (tagName === 'canvas') {
	      return [window.canvas]
	    }
	    return []
	  },
	  querySelector: function querySelector(query) {
	    if (query === 'head') {
	      return document.head
	    } else if (query === 'body') {
	      return document.body
	    } else if (query === 'canvas') {
	      return window.canvas
	    } else if (query === '#' + window.canvas.id) {
	      return window.canvas
	    }
	    return null
	  },
	  querySelectorAll: function querySelectorAll(query) {
	    if (query === 'head') {
	      return [document.head]
	    } else if (query === 'body') {
	      return [document.body]
	    } else if (query === 'canvas') {
	      return [window.canvas]
	    }
	    return []
	  },
	  addEventListener: function addEventListener(type, listener) {
	    if (!events[type]) {
	      events[type] = []
	    }
	    events[type].push(listener)
	  },
	  removeEventListener: function removeEventListener(type, listener) {
	    var listeners = events[type]

	    if (listeners && listeners.length > 0) {
	      for (var i = listeners.length; i--; i > 0) {
	        if (listeners[i] === listener) {
	          listeners.splice(i, 1)
	          break
	        }
	      }
	    }
	  },
	  dispatchEvent: function dispatchEvent(event) {
	    var listeners = events[event.type]

	    if (listeners) {
	      for (var i = 0; i < listeners.length; i++) {
	        listeners[i](event)
	      }
	    }
	  }
	}

	exports.default = document

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict"

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	exports.default = Image
	function Image() {
	  var image = wx.createImage()

	  return image
	}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	var _HTMLAudioElement2 = __webpack_require__(13)

	var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var HAVE_NOTHING = 0
	var HAVE_METADATA = 1
	var HAVE_CURRENT_DATA = 2
	var HAVE_FUTURE_DATA = 3
	var HAVE_ENOUGH_DATA = 4

	var _innerAudioContext = new WeakMap()
	var _src = new WeakMap()
	var _loop = new WeakMap()
	var _autoplay = new WeakMap()

	var Audio = function (_HTMLAudioElement) {
	  _inherits(Audio, _HTMLAudioElement)

	  function Audio(url) {
	    _classCallCheck(this, Audio)

	    var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this))

	    _this.HAVE_NOTHING = HAVE_NOTHING
	    _this.HAVE_METADATA = HAVE_METADATA
	    _this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA
	    _this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA
	    _this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA
	    _this.readyState = HAVE_NOTHING


	    _src.set(_this, '')

	    var innerAudioContext = wx.createInnerAudioContext()

	    _innerAudioContext.set(_this, innerAudioContext)

	    innerAudioContext.onCanplay(function () {
	      _this.dispatchEvent({ type: 'load' })
	      _this.dispatchEvent({ type: 'loadend' })
	      _this.dispatchEvent({ type: 'canplay' })
	      _this.dispatchEvent({ type: 'canplaythrough' })
	      _this.dispatchEvent({ type: 'loadedmetadata' })
	      _this.readyState = HAVE_CURRENT_DATA
	    })
	    innerAudioContext.onPlay(function () {
	      _this.dispatchEvent({ type: 'play' })
	    })
	    innerAudioContext.onPause(function () {
	      _this.dispatchEvent({ type: 'pause' })
	    })
	    innerAudioContext.onEnded(function () {
	      _this.dispatchEvent({ type: 'ended' })
	      _this.readyState = HAVE_ENOUGH_DATA
	    })
	    innerAudioContext.onError(function () {
	      _this.dispatchEvent({ type: 'error' })
	    })

	    if (url) {
	      _innerAudioContext.get(_this).src = url
	    }
	    return _this
	  }

	  _createClass(Audio, [{
	    key: 'load',
	    value: function load() {
	      console.warn('HTMLAudioElement.load() is not implemented.')
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      _innerAudioContext.get(this).play()
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      _innerAudioContext.get(this).pause()
	    }
	  }, {
	    key: 'canPlayType',
	    value: function canPlayType() {
	      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

	      if (typeof mediaType !== 'string') {
	        return ''
	      }

	      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
	        return 'probably'
	      }
	      return ''
	    }
	  }, {
	    key: 'cloneNode',
	    value: function cloneNode() {
	      var newAudio = new Audio()
	      newAudio.loop = _innerAudioContext.get(this).loop
	      newAudio.autoplay = _innerAudioContext.get(this).loop
	      newAudio.src = this.src
	      return newAudio
	    }
	  }, {
	    key: 'currentTime',
	    get: function get() {
	      return _innerAudioContext.get(this).currentTime
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).seek(value)
	    }
	  }, {
	    key: 'src',
	    get: function get() {
	      return _src.get(this)
	    },
	    set: function set(value) {
	      _src.set(this, value)
	      _innerAudioContext.get(this).src = value
	    }
	  }, {
	    key: 'loop',
	    get: function get() {
	      return _innerAudioContext.get(this).loop
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).loop = value
	    }
	  }, {
	    key: 'autoplay',
	    get: function get() {
	      return _innerAudioContext.get(this).autoplay
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).autoplay = value
	    }
	  }, {
	    key: 'paused',
	    get: function get() {
	      return _innerAudioContext.get(this).paused
	    }
	  }])

	  return Audio
	}(_HTMLAudioElement3.default)

	exports.default = Audio

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _HTMLMediaElement2 = __webpack_require__(14)

	var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var HTMLAudioElement = function (_HTMLMediaElement) {
	  _inherits(HTMLAudioElement, _HTMLMediaElement)

	  function HTMLAudioElement() {
	    _classCallCheck(this, HTMLAudioElement)

	    return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, 'audio'))
	  }

	  return HTMLAudioElement
	}(_HTMLMediaElement3.default)

	exports.default = HTMLAudioElement

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	var _HTMLElement2 = __webpack_require__(4)

	var _HTMLElement3 = _interopRequireDefault(_HTMLElement2)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return call && (typeof call === "object" || typeof call === "function") ? call : self }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

	var HTMLMediaElement = function (_HTMLElement) {
	  _inherits(HTMLMediaElement, _HTMLElement)

	  function HTMLMediaElement(type) {
	    _classCallCheck(this, HTMLMediaElement)

	    return _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, type))
	  }

	  _createClass(HTMLMediaElement, [{
	    key: 'addTextTrack',
	    value: function addTextTrack() {}
	  }, {
	    key: 'captureStream',
	    value: function captureStream() {}
	  }, {
	    key: 'fastSeek',
	    value: function fastSeek() {}
	  }, {
	    key: 'load',
	    value: function load() {}
	  }, {
	    key: 'pause',
	    value: function pause() {}
	  }, {
	    key: 'play',
	    value: function play() {}
	  }])

	  return HTMLMediaElement
	}(_HTMLElement3.default)

	exports.default = HTMLMediaElement

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	__webpack_require__(16)

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	var _window = __webpack_require__(1)

	var window = _interopRequireWildcard(_window)

	var _document = __webpack_require__(10)

	var _document2 = _interopRequireDefault(_document)

	var _util = __webpack_require__(8)

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key] } } newObj.default = obj; return newObj } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	var TouchEvent = function TouchEvent(type) {
	  _classCallCheck(this, TouchEvent)

	  this.target = window.canvas
	  this.currentTarget = window.canvas
	  this.touches = []
	  this.targetTouches = []
	  this.changedTouches = []
	  this.preventDefault = _util.noop
	  this.stopPropagation = _util.noop

	  this.type = type
	}

	function touchEventHandlerFactory(type) {
	  return function (event) {
	    var touchEvent = new TouchEvent(type)

	    touchEvent.touches = event.touches
	    touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
	    touchEvent.changedTouches = event.changedTouches
	    touchEvent.timeStamp = event.timeStamp
	    _document2.default.dispatchEvent(touchEvent)
	  }
	}

	wx.onTouchStart(touchEventHandlerFactory('touchstart'))
	wx.onTouchMove(touchEventHandlerFactory('touchmove'))
	wx.onTouchEnd(touchEventHandlerFactory('touchend'))
	wx.onTouchCancel(touchEventHandlerFactory('touchcancel'))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _util = __webpack_require__(8)

	// TODO 需要 wx.getSystemInfo 获取更详细信息
	var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	    platform = _wx$getSystemInfoSync.platform

	var navigator = {
	  platform: platform,
	  language: 'zh-cn',
	  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
	  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/zh_CN',
	  onLine: true, // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

	  // TODO 用 wx.getLocation 来封装 geolocation
	  geolocation: {
	    getCurrentPosition: _util.noop,
	    watchPosition: _util.noop,
	    clearWatch: _util.noop
	  }
	}

	exports.default = navigator

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	var _url = new WeakMap()
	var _method = new WeakMap()
	var _requestHeader = new WeakMap()
	var _responseHeader = new WeakMap()
	var _requestTask = new WeakMap()

	function _triggerEvent(type) {
	  if (typeof this['on' + type] === 'function') {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key]
	    }

	    this['on' + type].apply(this, args)
	  }
	}

	function _changeReadyState(readyState) {
	  this.readyState = readyState
	  _triggerEvent.call(this, 'readystatechange')
	}

	var XMLHttpRequest = function () {
	  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
	  function XMLHttpRequest() {
	    _classCallCheck(this, XMLHttpRequest)

	    this.onabort = null
	    this.onerror = null
	    this.onload = null
	    this.onloadstart = null
	    this.onprogress = null
	    this.ontimeout = null
	    this.onloadend = null
	    this.onreadystatechange = null
	    this.readyState = 0
	    this.response = null
	    this.responseText = null
	    this.responseType = ''
	    this.responseXML = null
	    this.status = 0
	    this.statusText = ''
	    this.upload = {}
	    this.withCredentials = false

	    _requestHeader.set(this, {
	      'content-type': 'application/x-www-form-urlencoded'
	    })
	    _responseHeader.set(this, {})
	  }

	  /*
	   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
	   */


	  _createClass(XMLHttpRequest, [{
	    key: 'abort',
	    value: function abort() {
	      var myRequestTask = _requestTask.get(this)

	      if (myRequestTask) {
	        myRequestTask.abort()
	      }
	    }
	  }, {
	    key: 'getAllResponseHeaders',
	    value: function getAllResponseHeaders() {
	      var responseHeader = _responseHeader.get(this)

	      return Object.keys(responseHeader).map(function (header) {
	        return header + ': ' + responseHeader[header]
	      }).join('\n')
	    }
	  }, {
	    key: 'getResponseHeader',
	    value: function getResponseHeader(header) {
	      return _responseHeader.get(this)[header]
	    }
	  }, {
	    key: 'open',
	    value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
	      _method.set(this, method)
	      _url.set(this, url)
	      _changeReadyState.call(this, XMLHttpRequest.OPENED)
	    }
	  }, {
	    key: 'overrideMimeType',
	    value: function overrideMimeType() {}
	  }, {
	    key: 'send',
	    value: function send() {
	      var _this = this

	      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

	      if (this.readyState !== XMLHttpRequest.OPENED) {
	        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.")
	      } else {
	        wx.request({
	          data: data,
	          url: _url.get(this),
	          method: _method.get(this),
	          header: _requestHeader.get(this),
	          responseType: this.responseType,
	          success: function success(_ref) {
	            var data = _ref.data,
	                statusCode = _ref.statusCode,
	                header = _ref.header

	            if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
	              try {
	                data = JSON.stringify(data)
	              } catch (e) {
	                data = data
	              }
	            }

	            _this.status = statusCode
	            _responseHeader.set(_this, header)
	            _triggerEvent.call(_this, 'loadstart')
	            _changeReadyState.call(_this, XMLHttpRequest.HEADERS_RECEIVED)
	            _changeReadyState.call(_this, XMLHttpRequest.LOADING)

	            _this.response = data

	            if (data instanceof ArrayBuffer) {
	              _this.responseText = ''
	              var bytes = new Uint8Array(data)
	              var len = bytes.byteLength

	              for (var i = 0; i < len; i++) {
	                _this.responseText += String.fromCharCode(bytes[i])
	              }
	            } else {
	              _this.responseText = data
	            }
	            _changeReadyState.call(_this, XMLHttpRequest.DONE)
	            _triggerEvent.call(_this, 'load')
	            _triggerEvent.call(_this, 'loadend')
	          },
	          fail: function fail(_ref2) {
	            var errMsg = _ref2.errMsg

	            // TODO 规范错误
	            if (errMsg.indexOf('abort') !== -1) {
	              _triggerEvent.call(_this, 'abort')
	            } else {
	              _triggerEvent.call(_this, 'error', errMsg)
	            }
	            _triggerEvent.call(_this, 'loadend')
	          }
	        })
	      }
	    }
	  }, {
	    key: 'setRequestHeader',
	    value: function setRequestHeader(header, value) {
	      var myHeader = _requestHeader.get(this)

	      myHeader[header] = value
	      _requestHeader.set(this, myHeader)
	    }
	  }])

	  return XMLHttpRequest
	}()

	XMLHttpRequest.UNSEND = 0
	XMLHttpRequest.OPENED = 1
	XMLHttpRequest.HEADERS_RECEIVED = 2
	XMLHttpRequest.LOADING = 3
	XMLHttpRequest.DONE = 4
	exports.default = XMLHttpRequest

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } }()

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	var _socketTask = new WeakMap()

	var WebSocket = function () {
	  // TODO 更新 binaryType
	  // The connection is in the process of closing.
	  // The connection is not yet open.
	  function WebSocket(url) {
	    var _this = this

	    var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []

	    _classCallCheck(this, WebSocket)

	    this.binaryType = ''
	    this.bufferedAmount = 0
	    this.extensions = ''
	    this.onclose = null
	    this.onerror = null
	    this.onmessage = null
	    this.onopen = null
	    this.protocol = ''
	    this.readyState = 3

	    if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
	      throw new TypeError('Failed to construct \'WebSocket\': The URL \'' + url + '\' is invalid')
	    }

	    this.url = url
	    this.readyState = WebSocket.CONNECTING

	    var socketTask = wx.connectSocket({
	      url: url,
	      protocols: Array.isArray(protocols) ? protocols : [protocols]
	    })

	    _socketTask.set(this, socketTask)

	    socketTask.onClose(function (res) {
	      _this.readyState = WebSocket.CLOSED
	      if (typeof _this.onclose === 'function') {
	        _this.onclose(res)
	      }
	    })

	    socketTask.onMessage(function (res) {
	      if (typeof _this.onmessage === 'function') {
	        _this.onmessage(res)
	      }
	    })

	    socketTask.onOpen(function () {
	      _this.readyState = WebSocket.OPEN
	      if (typeof _this.onopen === 'function') {
	        _this.onopen()
	      }
	    })

	    socketTask.onError(function (res) {
	      if (typeof _this.onerror === 'function') {
	        _this.onerror(new Error(res.errMsg))
	      }
	    })

	    return this
	  } // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
	  // TODO 更新 bufferedAmount
	  // The connection is closed or couldn't be opened.

	  // The connection is open and ready to communicate.


	  _createClass(WebSocket, [{
	    key: 'close',
	    value: function close(code, reason) {
	      this.readyState = WebSocket.CLOSING
	      var socketTask = _socketTask.get(this)

	      socketTask.close({
	        code: code,
	        reason: reason
	      })
	    }
	  }, {
	    key: 'send',
	    value: function send(data) {
	      if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
	        throw new TypeError('Failed to send message: The data ' + data + ' is invalid')
	      }

	      var socketTask = _socketTask.get(this)

	      socketTask.send({
	        data: data
	      })
	    }
	  }])

	  return WebSocket
	}()

	WebSocket.CONNECTING = 0
	WebSocket.OPEN = 1
	WebSocket.CLOSING = 2
	WebSocket.CLOSED = 3
	exports.default = WebSocket

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict"

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function") } }

	/*
	 * TODO 使用 wx.readFile 来封装 FileReader
	 */
	var FileReader = function FileReader() {
	  _classCallCheck(this, FileReader)
	}

	exports.default = FileReader

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	"use strict"

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	var localStorage = {
	  get length() {
	    var _wx$getStorageInfoSyn = wx.getStorageInfoSync(),
	        keys = _wx$getStorageInfoSyn.keys

	    return keys.length
	  },

	  key: function key(n) {
	    var _wx$getStorageInfoSyn2 = wx.getStorageInfoSync(),
	        keys = _wx$getStorageInfoSyn2.keys

	    return keys[n]
	  },
	  getItem: function getItem(key) {
	    return wx.getStorageSync(key)
	  },
	  setItem: function setItem(key, value) {
	    return wx.setStorageSync(key, value)
	  },
	  removeItem: function removeItem(key) {
	    wx.removeStorageSync(key)
	  },
	  clear: function clear() {
	    wx.clearStorageSync()
	  }
	}

	exports.default = localStorage

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict'

	Object.defineProperty(exports, "__esModule", {
	  value: true
	})
	var location = {
	  href: 'game.js',
	  reload: function reload() {}
	}

	exports.default = location

/***/ })
/******/ ])

/***/ })

/******/ });