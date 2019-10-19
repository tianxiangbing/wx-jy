import Hero from '../dev/js/hero';
/**
 * 动画类
 */
export default class Animate {
    list: Array<any> = [];
    index: number = 0;//动画开始序号
    speed:number = 10;
    frame =0;
    overframe = 1;//结束的帧数
    waiteMoment:0;//动画结束后的等待
    constructor(list,public callback?:Function,public hero?:Hero) {
        this.list = list//动画帧
    }
    play(callback?) {
        let item = this.list[this.index];
        let {x,y} = this.hero;
        if(this.frame == this.speed){
            this.frame = 0;
            this.index++;
            item.x ? x = x +item.x:null;
            item.y ? y = y +item.y:null;
        }
        // console.log(this.index)
        if(this.index == this.list.length){
            this.index= 0;
            callback&&callback(this);
            this.callback &&this.callback(this);
        }
        this.frame ++
        return Object.assign({},item,{x,y});
    }
    stop(){
        this.index = 0;
        this.callback &&this.callback();
    }
}