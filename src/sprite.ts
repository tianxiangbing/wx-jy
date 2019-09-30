import lib from "./lib";
import { Stage } from ".";

//sprite
//形状
export enum SHAPE {
    rect,
    circle
}
interface SP {
    x: number,
    y: number,
    width: number,
    height: number,
    visible: boolean,
    type: SHAPE
}
/**
 * 游戏基础的精灵类
 */
export default class Sprite implements SP {
    width: number;
    height: number;
    x: number;
    y: number;
    visible: boolean;
    type:SHAPE = SHAPE.rect;
    constructor(public stage:Stage,public imgSrc = '', width = 0, height = 0, x = 0, y = 0) {

        this.width = width
        this.height = height

        this.x = x
        this.y = y

        this.visible = true
    }

    /**
     * 将精灵图绘制在canvas上
     */
    draw() {
        if (!this.visible)
            return
        lib.draw(
            this.stage,
            this.imgSrc,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }

    /**
     * 简单的碰撞检测定义：
     * 另一个精灵的中心点处于本精灵所在的矩形内即可
     * @param{Sprite} sp: Sptite的实例
     */
    hits(sp: any) {
        let spX = sp.x + sp.width / 2
        let spY = sp.y + sp.height / 2

        if (!this.visible || !sp.visible)
            return false

        return !!(spX >= this.x
            && spX <= this.x + this.width
            && spY >= this.y
            && spY <= this.y + this.height)
    }
    touchHits(e){
        let touch = e.touches[0];
        return this.hits({x:touch.clientX,y:touch.clientY,width:0,height:0,visible:true});
    }
}
