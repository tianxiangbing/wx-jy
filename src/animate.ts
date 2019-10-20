import Sprite from './sprite';
//运动的类型 ，img为切图片的切换，size为大小的变化,distance为距离的变化
export enum EAnimateType{
//切换图片List的路径
img,
//为size时传入每次要改变的大小width、height差
size,
//为距离时传入每次运动的xy差
distance
}
/**
 * 动画类
 */
export default class Animate {
    list: Array<any> = [];
    index: number = 0;//动画开始序号
    speed:number = 10;
    frame =0;
    overframe = 1;//结束的帧数
    waiteMoment=0;//动画结束后的等待
    loopNum:number=99999;//循环的次数
    overCallback:Function;//动画结束后的回调,结束条件为loopNum为0;
    puase = false;
    types:Array<EAnimateType> = [EAnimateType.img] //动画的类型，默认为图片的切换
    constructor(list,public callback?:Function,public hero?:Sprite,types:Array<EAnimateType>=[]) {
        this.list = list//动画帧
        types ? this.types = types:null;
        if(types.indexOf(EAnimateType.img) == -1 && this.list.length==0){
            //没有图片的时候取hero的图
            this.list=[{
                content:this.hero.content
            }]
        }
    }
    play(callback?) {
        let item = this.list[this.index];
        let {x,y} = this.hero;
        if(this.frame == this.speed && !this.puase){
            this.frame = 0;
            this.index++;
            item.x ? x = x +item.x:null;
            item.y ? y = y +item.y:null;
        }
        // console.log(this.index)
        if(this.index == this.list.length){
            this.loopNum --;
            this.index= 0;
            this.overframe = this.frame;
            this.waiteMoment ? this.puase  = true:null;
            if(this.frame-this.overframe == this.waiteMoment){
                this.puase = false;
                callback&&callback(this);
                this.callback &&this.callback(this);
            }
        }
        this.frame ++;
        let res = Object.assign({},item,{x,y});
        if(this.loopNum ==0){
            //动画结束
            this.overCallback(this,res)
        }
        return res;
    }
    stop(){
        this.index = 0;
        this.callback &&this.callback();
    }
}