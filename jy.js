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
const index_1 = __webpack_require__(/*! ../src/index */ "./src/index.ts");
wx.showShareMenu({
    withShareTicket: true
});
const canvas = wx.createCanvas();
const [height, width] = [canvas.height, canvas.width];
//创建舞台
let stage = new index_1.Stage(canvas, width, height, '#FFFFFF');
let title = new index_1.Title('打气球', stage);
title.create = (resolve) => {
    index_1.lib.write(stage, '一起来打气球');
    resolve();
};
let descript = new index_1.Descript(stage);
descript.create = (resolve) => __awaiter(void 0, void 0, void 0, function* () {
    index_1.lib.draw(stage, 'images/descript.jpg', 0, 0, stage.width, stage.height);
    // await lib.waitMoment(3000);
    //添加开始按钮的Sprite
    let btn = new index_1.Sprite(stage, 'images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    btn.draw();
    wx.onTouchStart((e) => {
        btn.touchHits(e, () => {
            wx.offTouchStart();
            resolve();
        });
    });
});
//气球类
class Ball extends index_1.Sprite {
    constructor() {
        super(...arguments);
        this.speed = 1; //速度
    }
    //更新位置
    update() {
        this.y -= this.speed;
        if (this.y + this.height < 0) {
            this.visible = false;
        }
    }
}
class Game extends index_1.JY {
    constructor() {
        super(...arguments);
        this.frame = 0; //帧数
        this.ballList = []; //所有球的集合
        this.score = 0; //分数
        this.life = 3;
    }
    reset() {
        this.score = 0;
        this.life = 3;
        this.ballList = [];
    }
    newGame() {
        this.stage.style = "green";
        this.setState(index_1.STATE.running);
        //事件绑定
        wx.onTouchStart(e => {
            let { clientX, clientY } = e;
            console.log(clientX, clientY);
            this.ballList.forEach((ball, index) => {
                //触碰回收球并播放声音
                ball.touchHits(e, () => {
                    this.ballList.splice(index, 1);
                    this.score++;
                    index_1.lib.play('audio/boom.mp3');
                });
            });
        });
    }
    running() {
        return __awaiter(this, void 0, void 0, function* () {
            this.frame++;
            //先清空场景
            this.stage.clear();
            this.createSprite();
            this.ballList.forEach((ball, index) => {
                ball.update();
                ball.draw();
                //回收球
                if (!ball.visible) {
                    this.ballList.splice(index, 1);
                    this.life--;
                    if (this.life <= 0) {
                        this.setState(index_1.STATE.gameOver);
                    }
                }
            });
            this.showScore();
        });
    }
    //显示分数信息
    showScore() {
        index_1.lib.write(stage, '生命值：' + this.life, 10, 20);
        index_1.lib.write(stage, '得分：' + this.score, 10, 50);
    }
    //创建角色
    createSprite() {
        //100帧创建一个角色
        var chance = Math.floor(Math.random() * 800);
        if (chance < this.score / 5 * 2 + 10) {
            let x = index_1.lib.random(0, stage.width - 30);
            let w = 40;
            let h = 340 / 120 * w;
            let ball = new Ball(this.stage, 'images/ball.png', w, h, x, this.stage.height);
            // ball.touchHits(this.touch)
            ball.speed += this.score / 3;
            this.ballList.push(ball);
        }
    }
    gameOver() {
        return __awaiter(this, void 0, void 0, function* () {
            stage.clear();
            index_1.lib.write(stage, '游戏结束！总得分：' + this.score);
            wx.shareAppMessage({
                title: '最爱打气球',
                imageUrl: canvas.toTempFilePathSync({
                    destWidth: 500,
                    destHeight: 400
                })
            });
            yield index_1.lib.waitMoment(3000);
            this.reset();
            this.setState(index_1.STATE.descript);
        });
    }
}
let mygame = new Game(stage, title, descript);
mygame.resources = [
    'images/ball.png',
    'images/btn-start.png',
    'images/descript.jpg',
    'audio/boom.mp3'
];
mygame.setup();


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
        wx.onTouchStart(() => {
            console.log('touch...');
            wx.offTouchStart();
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
__webpack_require__(/*! ./wx-adpater */ "./src/wx-adpater.ts");
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
exports.default = {
    /*
    * 暂停一段时间
    */
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
    write(stage, text, x, y, font = "14px Arial", fillStyle = '#000000') {
        let context = stage.context;
        context.font = font;
        context.fillStyle = fillStyle;
        if (x == undefined) {
            x = (stage.width - text.length * 14) / 2;
        }
        if (y == undefined) {
            y = stage.height / 2 - 15;
        }
        context.fillText(text, x, y);
    },
    //导入图片
    draw(stage, img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight) {
        let context = stage.context;
        // let image = wx.createImage();
        let image = this.caches[img];
        let args = Array.prototype.slice.call(arguments, 2);
        args.unshift(image);
        console.log('draw', img);
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
        return new Promise(resolve => {
            for (let k in files) {
                if (/\.(jpg|gif|png|bmg|jpeg)/.test(files[k])) {
                    //图片的预加载
                    arr.push(new Promise(resolve => {
                        let image = wx.createImage();
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
                        let audio = wx.createInnerAudioContext();
                        audio.src = files[k];
                        audio.onCanplay(() => {
                            console.log(2222);
                            this.caches[files[k]] = audio;
                            resolve();
                        });
                    }));
                }
            }
            return Promise.all(arr).catch(() => {
                console.log('加载资源出错.');
            }).then(() => {
                console.log('加载资源完成.');
                resolve();
            });
        });
    },
    play(url) {
        //播放声音
        this.caches[url].stop();
        this.caches[url].play();
    }
};


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
})(SHAPE = exports.SHAPE || (exports.SHAPE = {}));
/**
 * 游戏基础的精灵类
 */
class Sprite {
    constructor(stage, imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
        this.stage = stage;
        this.imgSrc = imgSrc;
        this.type = SHAPE.rect;
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
        lib_1.default.draw(this.stage, this.imgSrc, this.x, this.y, this.width, this.height);
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

/***/ "./src/wx-adpater.ts":
/*!***************************!*\
  !*** ./src/wx-adpater.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * 对h5和wx进行兼容处理
 */
if (!window['wx']) {
}


/***/ })

/******/ });
//# sourceMappingURL=jy.js.map