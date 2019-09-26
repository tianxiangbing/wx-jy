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
/******/ 	return __webpack_require__(__webpack_require__.s = "./dev/game.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dev/game.ts":
/*!*********************!*\
  !*** ./dev/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ../src/index */ "./src/index.ts");
const canvas = wx.createCanvas();
const [height, width] = [canvas.height, canvas.width];
// console.log(canvas.height,canvas.width)
const context = canvas.getContext('2d');
//创建舞台
let stage = new index_1.Stage(context, width, height, '#FFFFFF');
class Game extends index_1.JY {
    running() {
        console.log('my running');
    }
}
new Game(stage);


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
    constructor(btntitle, text) {
        this.btntitle = btntitle;
        this.text = text;
        console.log(arguments);
    }
    create(callback) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        let btn = document.createElement('button');
        btn.className = 'button start';
        btn.innerText = this.btntitle;
        // btn.onclick = callback.bind(this);
        btn.addEventListener('touchstart', function (event) {
            callback.call(this);
        }.bind(this), false);
        btn.addEventListener('click', function (event) {
            callback.call(this);
        }.bind(this), false);
        this.elem.appendChild(btn);
        return this.elem;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
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
const control_1 = __webpack_require__(/*! ./control */ "./src/control.ts");
exports.Control = control_1.default;
const descript_1 = __webpack_require__(/*! ./descript */ "./src/descript.ts");
exports.Descript = descript_1.default;
const gameOver_1 = __webpack_require__(/*! ./gameOver */ "./src/gameOver.ts");
exports.GameOver = gameOver_1.default;
const score_1 = __webpack_require__(/*! ./score */ "./src/score.ts");
exports.Score = score_1.default;
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
exports.Sprite = sprite_1.default;
const stage_1 = __webpack_require__(/*! ./stage */ "./src/stage.ts");
exports.Stage = stage_1.default;
const title_1 = __webpack_require__(/*! ./title */ "./src/title.ts");
exports.Title = title_1.default;
const writeText_1 = __webpack_require__(/*! ./writeText */ "./src/writeText.ts");
exports.WriteText = writeText_1.default;


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
/// <reference path="score.ts" />
/// <reference path="writeText.ts" />
*/
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
const score_1 = __webpack_require__(/*! ./score */ "./src/score.ts");
const lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
//游戏主框架
var STATE;
(function (STATE) {
    STATE[STATE["loading"] = 0] = "loading";
    STATE[STATE["title"] = 1] = "title";
    STATE[STATE["descript"] = 2] = "descript";
    STATE[STATE["newGame"] = 3] = "newGame";
    STATE[STATE["running"] = 4] = "running";
    STATE[STATE["pause"] = 5] = "pause";
    STATE[STATE["levelUp"] = 6] = "levelUp";
    STATE[STATE["die"] = 7] = "die";
    STATE[STATE["gameOver"] = 8] = "gameOver";
})(STATE = exports.STATE || (exports.STATE = {}));
class JY {
    constructor(stage, titleStage, descriptStage, gameOverStage, controlStage) {
        this.stage = stage;
        this.titleStage = titleStage;
        this.descriptStage = descriptStage;
        this.gameOverStage = gameOverStage;
        this.controlStage = controlStage;
        this.func = new Function;
        this.interval = 10;
        this.setup();
    }
    setup() {
        this.freshFrame();
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
    }
    // 实现游戏帧循环
    freshFrame() {
        // console.log(+new Date())
        this.aniId = window.requestAnimationFrame(this.freshFrame.bind(this));
    }
    run() {
        console.log('run');
        //this.func();
        this.descriptStage.remove();
        this.controlStage && this.createControl();
        this.setState(STATE.newGame);
    }
    //分数面板
    scoreInit() {
        this.scoreScreen = new score_1.default('--');
        // this.view.appendChild(this.scoreScreen.create());
    }
    createControl() {
        // this.view.appendChild(this.controlStage.create());
    }
    //新的开始
    newGame() {
        //游戏开始，清空场景
        //打开计时器
        this.scoreInit();
        this.setState(STATE.running);
        this.startTimer();
    }
    //结束 
    over() {
        this.setState(STATE.gameOver);
    }
    //暂停
    pause() {
        this.stopTimer();
    }
    //暂停后的继续
    play() {
        this.startTimer();
    }
    //游戏结束
    gameOver() {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        // this.scoreScreen.remove();
        this.stage.clear();
        this.controlStage && this.controlStage.remove();
        this.stopTimer();
        let gameOver = this.gameOverStage.create(function () {
            this.gameOverStage.remove();
            this.setState(STATE.descript);
        }.bind(this));
        // this.view.appendChild(gameOver);
    }
    //停止刷新
    stopTimer() {
        clearInterval(this.timer);
    }
    //刷新帧
    startTimer() {
        let _this = this;
        this.timer = setInterval(function () {
            _this.func.bind(_this)();
        }, this.interval);
    }
    //游戏中的
    running() {
        // console.log('running...')
        this.context.clearRect(0, 0, this.stage.width, this.stage.height);
    }
    loading() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading....');
            yield this.showLoading();
            this.setState(STATE.title);
        });
    }
    showLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            yield lib_1.default.waitMoment(3000);
        });
    }
    title() {
    }
    //检查状态
    checkState() {
        switch (this.currentState) {
            case STATE.loading:
                this.func = this.loading;
                break;
            case STATE.title:
                this.func = this.title;
                break;
            case STATE.descript:
                // this.func = this.descript;
                break;
            case STATE.newGame:
                this.func = this.newGame;
                break;
            case STATE.running:
                this.func = this.running;
                break;
            case STATE.gameOver:
                this.func = this.gameOver;
            default:
                break;
        }
    }
    setState(state) {
        this.currentState = state;
        this.checkState();
        this.func();
    }
    //碰撞检测
    hits(oA, oB) {
        var bx = false, by = false;
        if (oA.shape == sprite_1.SHAPE.rect) {
            var bw = oB.w;
            var aw = oA.w;
            var bh = oB.h;
            var ah = oA.h;
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
        else if (oA.shape == sprite_1.SHAPE.circle) {
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
exports.default = {
    /*
    * 暂停一段时间
    */
    //暂停一段时间
    waitMoment(second) {
        return __awaiter(this, void 0, void 0, function* () {
            let t = +new Date();
            return new Promise(resolve => {
                let n = +new Date();
                if (n - t >= second) {
                    resolve();
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/score.ts":
/*!**********************!*\
  !*** ./src/score.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Score {
    constructor(text) {
        this.text = text;
        console.log(arguments);
    }
    create(callback) {
        this.elem = document.createElement('div');
        this.elem.className = "score";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        this.elem.style.right = this.right || '10px';
        this.elem.style.top = this.top || '10px';
        return this.elem;
    }
    change(text) {
        this.text = text;
        this.elem.innerHTML = this.text;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}
exports.default = Score;


/***/ }),

/***/ "./src/sprite.ts":
/*!***********************!*\
  !*** ./src/sprite.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//sprite
//形状
var SHAPE;
(function (SHAPE) {
    SHAPE[SHAPE["rect"] = 0] = "rect";
    SHAPE[SHAPE["circle"] = 1] = "circle";
})(SHAPE = exports.SHAPE || (exports.SHAPE = {}));
class Sprite {
    constructor(context, url) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.w = 0; //宽度 
        this.h = 0; //高度
        this.sw = 0; //剪裁的宽
        this.sh = 0; //前裁的高
        this.sx = 0; //剪裁的x
        this.sy = 0; //前裁的y
        this.r = 0; //半径
        this.shape = SHAPE.rect; //默认方形
        this.getImg(url);
        this.context = context;
    }
    setImg(url) {
        this.getImg(url);
    }
    getImg(url) {
        //地址转换成img对象 
        // this.img = new Image();
        this.img.src = url;
        // this.img = document.createElement('img');
        // this.img.src = url;
        // console.log(this.img.readyState)
        // this.img.onreadystatechange=function(){
        //     console.log(222,this.img.readyState)
        // }
        this.img.onload = function () {
            console.log('loaded');
        };
        // this.img = document.createElement('img');
        // this.img.src = url;
    }
    setSize(w, h) {
        this.w = w || this.w;
        this.h = h || this.h;
        this.r = this.h / 2;
    }
    getCenter() {
        //圆心位置
        return [this.x + this.r, this.y + this.r];
    }
    setCutSize(sw, sh) {
        this.sw = sw;
        this.sh = sh;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(angle) {
        this.context.save();
        if (angle) {
            this.context.translate(this.x + this.r, this.y + this.r);
            this.context.rotate(angle);
            this.context.translate(-(this.x + this.r), -(this.y + this.r));
        }
        if (this.sw && this.sh) {
            this.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
        }
        else {
            //不需要剪切
            this.context.drawImage(this.img, Math.round(this.x), Math.round(this.y), this.w, this.h);
        }
        // this.context.drawImage(this.img,10,10);
        this.context.restore();
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
    constructor(context, width, height, style) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.style = style;
    }
    draw(style) {
        this.context.fillStyle = this.style;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    //绑定事件回调
    bindEvent(callback) {
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
class Title {
    constructor(title) {
        this.title = title;
        console.log(arguments);
    }
    create(callback) {
        this.elem = document.createElement('div');
        this.elem.className = "title";
        this.elem.style.position = 'absolute';
        this.elem.innerHTML = this.title;
        return this.elem;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}
exports.default = Title;


/***/ }),

/***/ "./src/writeText.ts":
/*!**************************!*\
  !*** ./src/writeText.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WriteText {
    constructor(context) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.context = context;
    }
    write(text, x, y, style = '', fillStyle = '') {
        this.x = x;
        this.y = y;
        this.context.font = style;
        this.context.fillStyle = fillStyle;
        this.context.fillText(text, this.x, this.y);
    }
}
exports.default = WriteText;


/***/ })

/******/ });
//# sourceMappingURL=game.js.map