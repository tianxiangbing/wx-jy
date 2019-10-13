/**
 * 动画类
 */
export default class Animate {
    list: [] = [];
    index: number = 0;//动画开始序号
    speed:number = 10;
    frame =0;
    constructor(list) {
        this.list = list//动画帧
    }
    play() {
        let item = this.list[this.index];
        this.frame ++
        if(this.frame == 10){
            this.frame = 0;
            this.index++;
        }
        // console.log(this.index)
        if(this.index == this.list.length){
            this.index= 0;
        }
        return item;
    }
    stop(){
        this.index = 0;
    }
}