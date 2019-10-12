import {
    JY,
    STATE,
    Stage,
    Title,
    Descript,
    Sprite,
    lib
} from '../src/index';
// wx.showShareMenu({
// withShareTicket: true
// })

const canvas = lib.createCanvas();
const [height, width] = [canvas.height, canvas.width]

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
    let btn = new Sprite(stage, 'images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    btn.draw();
    lib.addEventListener(stage.canvas,'touchstart',(e) => {
        btn.touchHits(e,()=>{
            lib.removeEventListener(stage.canvas,'touchstart')
            resolve()
        })
    });
}
//气球类
class Ball extends Sprite {
    speed: number = 1;//速度
    //更新位置
    update() {
        this.y -= this.speed;
        if (this.y+this.height < 0) {
            this.visible = false;
        }
    }
}
class Game extends JY {
    frame: number = 0;//帧数
    ballList: Ball[] = [];//所有球的集合
    score = 0 ;//分数
    life = 3;
    reset(){
        this.score= 0 ;
        this.life = 3;
        this.ballList = [];
    }
    newGame() {
        this.stage.style = "green";
        this.setState(STATE.running);
        //事件绑定
        lib.addEventListener(this.stage.canvas,'touchstart',e => {
            let { clientX, clientY } = e;
            console.log(clientX, clientY)
            this.ballList.forEach((ball,index) => {
                //触碰回收球并播放声音
                ball.touchHits(e,()=>{
                    this.ballList.splice(index,1);
                    this.score ++;
                    lib.play('audio/boom.mp3');
                })
            });
        });
    }
    async running() {
        this.frame++;
        //先清空场景
        this.stage.clear();
        this.createSprite();
        this.ballList.forEach((ball,index) => {
            ball.update();
            ball.draw();
            //回收球
            if(!ball.visible){
                this.ballList.splice(index,1);
                this.life--;
                if(this.life<=0){
                    this.setState(STATE.gameOver);
                }
            }
        });
        this.showScore();
    }
    //显示分数信息
    showScore(){
        lib.write(stage, '生命值：'+this.life,10,20);
        lib.write(stage, '得分：'+this.score,10,50);
    }
    //创建角色
    createSprite() {
        //100帧创建一个角色
        var chance = Math.floor(Math.random()*800);
        if (chance < this.score/5*2+10) {
            let x = lib.random(0, stage.width - 30);
            let w = 40;
            let h = 340 / 120 * w;
            let ball = new Ball(this.stage, 'images/ball.png', w, h, x, this.stage.height);
            // ball.touchHits(this.touch)
            ball.speed += this.score/3;
            this.ballList.push(ball);
        }
    }
    async gameOver() {
        stage.clear();
        lib.write(stage, '游戏结束！总得分：'+this.score);
        // wx.shareAppMessage( {
        //     title: '最爱打气球',
        //     imageUrl: canvas.toTempFilePathSync({
        //     destWidth: 500,
        //     destHeight: 400
        //     })
        // }
        // )
        await lib.waitMoment(3000);
        this.reset();
        this.setState(STATE.descript);
    }
}

let mygame = new Game(stage, title, descript);
mygame.resources = [
    'images/ball.png',
    'images/btn-start.png',
    'images/descript.jpg',
    'audio/boom.mp3'
];
mygame.setup()