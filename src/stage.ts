//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Stage {
    elem: wx.CanvasContext;
    constructor(public context:wx.CanvasContext, public width: number, public height: number, public style?: string) {
        
    }
    draw(style?:string){
        this.context.fillStyle=this.style;
        this.context.fillRect(0,0,this.width,this.height)
    }
    clear(){
        this.context.clearRect(0,0,this.width,this.height);
    }
    //绑定事件回调
    bindEvent(callback?: Function) {
      
    }
}
