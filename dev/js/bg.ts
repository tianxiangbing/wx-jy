import Stage from '../../src/stage';
import Sprite, { SHAPE } from '../../src/sprite';
import { lib } from '../../src';
let bgList = [];
let width = 800;
let height = 164;
// for (let i = 212; i <= 216; i++) {
//     bgList.push(`images/bg/GObj[${i}].png`);
// }
export default class Bg{
    bgList = [];
    create(stage: Stage) {
        let w = stage.width;
        let x =0,y =0;
        let bg = new Sprite(stage, SHAPE.rect, 'images/bg/bg.jpg', stage.realWidth, stage.realHeight, 0, 0)
        // this.bgList.push(bg);
        while(x*width <stage.realWidth){
            let realPos = lib.transformRelatePosition(stage, {x:x*width,y:stage.height-height});
            // console.log(realPos)
            let bg = new Sprite(stage, SHAPE.rect, 'images/bg/floor.png', width,height, x*width,realPos.y);
            x++;
            // this.bgList.push(bg);
        }
    }
    draw() {
        this.bgList.forEach(element => {
            element.draw();
        });
    }
}