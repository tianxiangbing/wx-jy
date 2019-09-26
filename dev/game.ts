import {
    JY,
    Stage
} from '../src/index';
const canvas = wx.createCanvas();
const [height,width]=[canvas.height,canvas.width]
// console.log(canvas.height,canvas.width)
const context = canvas.getContext('2d');
//创建舞台
let stage = new Stage(context, width,height,'#FFFFFF');


class Game extends JY{
    running(){
        console.log('my running')
    }
}

new Game(stage);