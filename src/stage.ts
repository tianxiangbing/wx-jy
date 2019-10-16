//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
interface Center {
    x: number;
    y: number;
}
export default class Stage {
    context: CanvasRenderingContext2D;
    realWidth: number;
    realHeight: number;
    center: Center = { x: 0, y: 0 }
    deviation = { x: 0, y: 0 };//视图偏移值
    constructor(public canvas: HTMLCanvasElement, public width: number, public height: number, public style?: string) {
        this.context = canvas.getContext('2d');
        this.realHeight = this.height;
        this.realWidth = this.width
        this.center = { x: this.realWidth / 2, y: this.realHeight / 2 };
    }
    setDeviation(deviation) {
        let { x, y } = deviation;
        x = Math.max(Math.min(x, this.center.x), -this.center.x);
        y = Math.max(Math.min(y, this.center.y), -this.center.y);
        this.deviation = { x, y };
        // this.center.x = this.deviation.x;
        // this.center.y = this.deviation.y;
        // this.context.translate(this.deviation.x,this.deviation.y);
    }
    resetDeviation() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    draw(style?: string) {
        this.context.fillStyle = this.style;
        this.context.fillRect(0, 0, this.width, this.height)
    }
    //清空布景
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.draw();
    }
}
