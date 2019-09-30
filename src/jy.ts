/*
/// <reference path="sprite.ts" />
/// <reference path="title.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
/// <reference path="control.ts" />
/// <reference path="score.ts" />
*/
import Sprite, { SHAPE } from './sprite';
import Title from './title';
import Descript from './descript';
import GameOver from './gameOver';
import Stage from './stage';
import Control from './control';
import Score from './score';
import lib from './lib';

//游戏主框架
export enum STATE {
    loading,
    title,
    descript,
    newGame,
    running,
    gameOver
}
export default class JY {
    private func: Function = new Function;
    private timer: any;
    private aniId: number;
    private currentState: STATE;
    private ispause: boolean = false;//是否处于暂停状态
    protected interval: number = 10;
    protected context: wx.CanvasContext;
    protected scoreScreen: Score;
    resources:string[]=[];
    constructor(public stage: Stage, public titleStage?: Title, public descriptStage?: Descript, public gameOverStage?: GameOver, public controlStage?: Control) {
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
    async loop() {
        console.log('loop')
        if (!this.ispause) {
            await this.func();
        }
        this.aniId = window.requestAnimationFrame(
            ()=>{
                console.log('lloop.')
                this.loop()
            }
        )
    }
    //分数面板
    scoreInit() {
        this.scoreScreen = new Score('--');
    }
    createControl() {
    }
    //新的开始
    protected newGame() {
        //游戏开始，清空场景
        //打开计时器
        this.setState(STATE.running);
    }
    //结束 
    protected over() {
        this.setState(STATE.gameOver);
    }
    //暂停
    protected pause() {
        this.ispause = true;
        window.cancelAnimationFrame(this.aniId);
    }
    //暂停后的继续
    protected play() {
        this.ispause = false;
        this.loop();
    }
    //游戏结束
    protected gameOver() {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        // this.scoreScreen.remove();
        this.stage.clear();
        this.showGameOver();
    }
    //结束画面
    async showGameOver() {
        console.log('game  over...')
        await lib.waitMoment(3000);
    }
    //游戏中的
    running() {
        console.log('running...')
    }
    async loading() {
        console.log('loading....')
        await this.showLoading();
        console.log('loading end...')
        this.setState(STATE.title)
    }
    showLoading() {
        lib.write(this.stage, '正在加载中')
        return lib.loadImages(this.resources)
    }
    async title() {
        console.log('title....');
        await this.showTitle();
        this.setState(STATE.descript);
    }
    showTitle() {
        // this.titleStage.create()
        // return lib.waitMoment(3000);
        return new Promise(resolve => {
            this.titleStage.create(resolve);
        });
    }
    async descript() {
        console.log('descript...');
        await this.showDescript();
        this.setState(STATE.newGame);
    }
    showDescript() {
        return new Promise(resolve => {
            this.descriptStage.create(resolve);
        });
        // return lib.waitMoment(3000);
    }
    proxy(stageFunc: Function) {
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
    setState(state?: STATE) {
        this.currentState = state;
        this.checkState();
        this.func();
    }
    //碰撞检测
    hits(oA: Sprite, oB: Sprite) {
        var bx = false,
            by = false;
        if (oA.shape == SHAPE.rect) {
            var bw = oB.w;
            var aw = oA.w;
            var bh = oB.h;
            var ah = oA.h;
            if (oA.x > oB.x) {
                bx = oA.x - oB.x < bw;
            } else if (oA.x < oB.x) {
                bx = oB.x - oA.x < aw;
            } else {
                bx = true;
            };
            if (oA.y > oB.y) {
                by = oA.y - oB.y < bh;
            } else if (oA.y < oB.y) {
                by = oB.y - oA.y < ah;
            } else {
                by = true;
            };
            return (bx && by);
        } else if (oA.shape == SHAPE.circle) {
            var r2 = oA.r + oB.r;
            let oAc = oA.getCenter();
            let oBc = oB.getCenter();
            bx = Math.abs(oAc[0] - oBc[0]) < r2;
            by = Math.abs(oAc[1] - oBc[1]) < r2;
            return (bx && by);
        }
    }
}