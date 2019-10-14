//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Stage {
    context: CanvasRenderingContext2D;
    realWidth:number;
    realHeight:number;
    constructor(public canvas:HTMLCanvasElement, public width: number, public height: number, public style?: string) {
        this.context = canvas.getContext('2d');
        this.realHeight = this.height;
        this.realWidth = this.width
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
