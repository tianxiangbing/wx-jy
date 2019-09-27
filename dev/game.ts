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
const context = canvas.getContext('2d');
//创建舞台
let stage = new Stage(context, width, height, '#FFFFFF');
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
    let btn = new Sprite('images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    btn.draw(stage);
    wx.onTouchStart((e) => {
        if (btn.touchHits(e)) {
            wx.offTouchStart();
            resolve()
        }
    });
}
class Game extends JY {
    newGame() {
        wx.onTouchStart(e => {
            let { clientX, clientY } = e;
            console.log(clientX,clientY)
        });
        this.stage.style = "green";
        this.setState(STATE.running)
    }
    async running() {
        console.log('my running')
        await lib.waitMoment(4000);
        this.setState(STATE.gameOver);
    }
    async gameOver(){
        stage.clear();
        lib.write(stage,'游戏结束！');
        await lib.waitMoment(3000);
        this.setState(STATE.descript);
    }
}

new Game(stage, title, descript);