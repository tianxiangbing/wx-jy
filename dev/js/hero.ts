/**
 * hero
 */
import {
    Stage,
    Sprite,
    lib
} from '../../src/index';
import Attack from './attack';
import Socket from './socket';
import { SHAPE } from '../../src/sprite';
export enum EDirection {
    left,
    right,
    up,
    down
}
interface ISpeed {
    x: number,
    y: number
}
export default class Hero extends Sprite {
    speed: ISpeed = { x: 0, y: 0 };
    speedValue:number =2;
    name:string = Math.random().toString().split('.')[1];
    socket:Socket;
    msg ='';
    timer :number;
    talk(msg){
        this.msg = msg;
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            clearTimeout(this.timer)
            this.timer = 0;
            this.msg='';
        },5000)
    }
    showMsg(){
        //显示聊天
        let name = new Sprite(this.stage,SHAPE.text,{text:this.msg,font:"14px Arial",fillStyle:'blue'},100,20,this.x,this.y -50)
        name.draw();
    }
    move(direction: EDirection) {
        switch(direction){
            case EDirection.left:{
                this.speed.x =this.speedValue *-1;
                break;
            }
            case EDirection.right:{
                this.speed.x = this.speedValue ;
                break;
            }
            case EDirection.up:{
                this.speed.y = this.speedValue *-1
                break;
            }
            case EDirection.down:{
                this.speed.y = this.speedValue ;
                break;
            }
        }
        this.draw();
        this.socket.update(this);
    }
    stop(){
        this.speed.x = 0;
        this.speed.y = 0;
    }
    draw(){
        this.x +=  this.speed.x;
        this.y +=  this.speed.y;
        this.x = Math.min( Math.max(0,this.x),this.stage.width-this.width)
        this.y = Math.min( Math.max(20,this.y),this.stage.height-this.height)
        let name = new Sprite(this.stage,SHAPE.text,{text:this.name,font:"10px Arial"},100,20,this.x,this.y -30)
        name.draw();
        super.draw();
        this.msg && this.showMsg()
    }
    //攻击
    attack(attack: Attack) {
        let a = new Attack(this.stage, SHAPE.circle, 'images/attack.png', 10, 10, this.x, this.y)
        return a;
    }
}