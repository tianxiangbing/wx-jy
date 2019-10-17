import Stage from '../../src/stage';
import Sprite, { SHAPE } from '../../src/sprite';
let bgList = [];
let width = 96;
let height = 238;
for (let i = 212; i <= 216; i++) {
    bgList.push(`images/bg/GObj[${i}].png`);
}
export default class Bg{
    bgList = [];
    create(stage: Stage) {
        let w = stage.width;
        let x =0,y =0;
        // while(x*width <stage.width && y * height <stage.height){
            let bg = new Sprite(stage, SHAPE.rect, 'images/bg/bg.jpg', stage.realWidth, stage.realHeight, 0, 0)
            this.bgList.push(bg);
        // }
    }
    draw() {
        this.bgList.forEach(element => {
            element.draw();
        });
    }
}