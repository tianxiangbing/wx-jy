import {
    JY,
    Stage,
    Title,
    Descript,
    Sprite
} from '../src/index';
import lib from '../src/lib';
import { STATE } from '../src/jy';

const canvas = wx.createCanvas();
const [height, width] = [canvas.height, canvas.width]
// console.log(canvas.height,canvas.width)
// const context = canvas.getContext('2d');
//创建舞台
let stage = new Stage(canvas, width, height, '#FFFFFF');
let title = new Title('打气球', stage);
title.create = (resolve) => {
    lib.write(stage, '一起来打气球')
    resolve();
}
let descript = new Descript(stage)
descript.create = async (resolve) => {
    lib.draw(stage, 'images/descript.jpg', 0, 0, stage.width, stage.height)
    // await lib.waitMoment(3000);
    //添加开始按钮的Sprite
    let btn = new Sprite(stage,'images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    btn.draw();
    wx.onTouchStart((e) => {
        if (btn.touchHits(e)) {
            wx.offTouchStart();
            resolve()
        }
    });
}
//气球类
class Ball extends Sprite{
    speed:number=1;//速度
    //更新位置
    update(){
        this.y -=this.speed;
        if(this.y<0){
            this.visible=false;
        }
    }
}
class Game extends JY {
    frame:number=0;//帧数
    ballList:Ball[]=[];//所有球的集合
    newGame() {
        wx.onTouchStart(e => {
            let { clientX, clientY } = e;
            console.log(clientX,clientY)
        });
        this.stage.style = "green";
        this.setState(STATE.running)
    }
    async running() {
        this.frame++;
        //先清空场景
        this.stage.clear();
        this.createSprite();
        this.ballList.forEach(ball => {
            ball.update();
            ball.draw();
        });
        // console.log('my running')
        // await lib.waitMoment(4000);
        // this.setState(STATE.gameOver);

    }
    //创建角色
    createSprite(){
        //100帧创建一个角色
        if(this.frame%100==0){
            let x = lib.random(0,stage.width-30);
            let ball = new Ball(this.stage,'images/ball.png',30,60,x,this.stage.height)
            this.ballList.push(ball);
        }
    }
    async gameOver(){
        stage.clear();
        lib.write(stage,'游戏结束！');
        await lib.waitMoment(3000);
        this.setState(STATE.descript);
    }
}

let mygame = new Game(stage, title, descript);
mygame.resources= [
    'images/ball.png',
    'images/btn-start.png',
    'images/descript.jpg'
];
mygame.setup()