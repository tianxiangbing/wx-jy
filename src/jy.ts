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
import Sprite,{SHAPE} from './sprite';
import Title from './title';
import Descript from './descript';
import GameOver from './gameOver';
import Stage from './stage';
import Control from './control';
import Score from './score';
import WriteText from './writeText';
import lib from './lib';


//游戏主框架
export enum STATE {
    loading,
    title,
    descript,
    newGame,
    running,
    pause,
    levelUp,
    die,
    gameOver
}
export default class JY {
    private func: Function = new Function;
    private timer: any;
    private aniId :number;
    private currentState: STATE;
    protected interval: number = 10;
    protected context: wx.CanvasContext;
    protected scoreScreen: Score;

    files: any;
    constructor( public stage: Stage, public titleStage?: Title, public descriptStage?: Descript, public gameOverStage?: GameOver, public controlStage?: Control) {
        this.setup();
    }
    setup() {
        this.freshFrame();
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
    }
    // 实现游戏帧循环
    freshFrame(){
        // console.log(+new Date())
        this.aniId = window.requestAnimationFrame(
            this.freshFrame.bind(this)
        )
    }
    run() {
        console.log('run')
        //this.func();
        this.descriptStage.remove();
        this.controlStage && this.createControl();
        this.setState(STATE.newGame);
    }
    //分数面板
    scoreInit() {
        this.scoreScreen = new Score('--');
        // this.view.appendChild(this.scoreScreen.create());
    }
    createControl() {
        // this.view.appendChild(this.controlStage.create());
    }
    //新的开始
    protected newGame() {
        //游戏开始，清空场景
        //打开计时器
        this.scoreInit();
        this.setState(STATE.running);
        this.startTimer();
    }
    //结束 
    protected over() {
        this.setState(STATE.gameOver);
    }
    //暂停
    protected pause() {
        this.stopTimer();
    }
    //暂停后的继续
    protected play() {
        this.startTimer();
    }
    //游戏结束
    protected gameOver() {
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
        }, this.interval)
    }
    //游戏中的
    running() {
        // console.log('running...')
        
        this.context.clearRect(0, 0, this.stage.width, this.stage.height);
    }
    async loading(){
        console.log('loading....')
        await this.showLoading();
        this.setState(STATE.title)
    }
    async showLoading(){
        await lib.waitMoment(3000);
    }
    title(){

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