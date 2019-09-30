//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Stage {
    context: wx.CanvasContext;
    constructor(public canvas:wx.Canvas, public width: number, public height: number, public style?: string) {
        this.context = canvas.getContext('2d');
    }
    draw(style?:string){
        this.context.fillStyle=this.style;
        this.context.fillRect(0,0,this.width,this.height)
    }
    //清空布景
    clear(){
        this.context.clearRect(0,0,this.width,this.height);
        this.draw();
    }
}
