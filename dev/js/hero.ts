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
import Animate from '../../src/animate';

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
enum EStatus {
    standup,
    runing = 'runing',
    jump = '',
    attack = ''
}
export default class Hero extends Sprite {
    speed: ISpeed = { x: 0, y: 0 };
    speedValue: number = 20;
    name: string = Math.random().toString().split('.')[1];
    socket: Socket;
    msg = '';
    timer: number;
    content = 'images/hero/APimg[2].png';
    status: EStatus = EStatus.standup;
    animate = {};
    frame = 0;
    direction: EDirection;

    constructor(a1, a2, a3, a4, a5, a6, a7) {
        super(a1, a2, a3, a4, a5, a6, a7)
        this.animate[EStatus.runing] = new Animate(['images/hero/APimg[10].png', 'images/hero/APimg[11].png', 'images/hero/APimg[12].png', 'images/hero/APimg[13].png']);
        this.animate[EStatus.runing].speed = 10;
        this.animate[EStatus.standup] = new Animate(['images/hero/APimg[1].png']);
    }
    talk(msg) {
        this.msg = msg;
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            this.timer = 0;
            this.msg = '';
        }, 5000)
    }
    showMsg() {
        //显示聊天
        let name = new Sprite(this.stage, SHAPE.text, { text: this.msg, font: "14px Arial", fillStyle: 'blue' }, 100, 20, this.x, this.y - 50)
        name.draw();
    }
    move(direction: EDirection) {
        this.direction = direction;
        // switch(direction){
        //     case EDirection.left:{
        //         this.speed.x =this.speedValue *-1;
        //         break;
        //     }
        //     case EDirection.right:{
        //         this.speed.x = this.speedValue ;
        //         break;
        //     }
        //     case EDirection.up:{
        //         this.speed.y = this.speedValue *-1
        //         break;
        //     }
        //     case EDirection.down:{
        //         this.speed.y = this.speedValue ;
        //         break;
        //     }
        // }
        this.status = EStatus.runing;
        this.draw();
        this.socket.update(this);
    }
    moveAnimate() {
        let direction = this.direction;
        if (this.frame == 10 ) {
            this.frame = 1;
            switch (direction) {
                case EDirection.left: {
                    this.speed.x = this.speedValue * -1;
                    break;
                }
                case EDirection.right: {
                    this.speed.x = this.speedValue;
                    break;
                }
                case EDirection.up: {
                    this.speed.y = this.speedValue * -1
                    break;
                }
                case EDirection.down: {
                    this.speed.y = this.speedValue;
                    break;
                }
            }
            this.x += this.speed.x;
            this.y += this.speed.y;
            this.x = Math.min(Math.max(0, this.x), this.stage.width - this.width)
            let maxy = this.stage.height / this.stage.width * 440 - this.height;
            this.y = Math.min(Math.max(maxy, this.y), this.stage.height - this.height)
        }
        this.frame++;
    }
    stop() {
        this.status = EStatus.standup;
        this.speed.x = 0;
        this.speed.y = 0;
        this.frame = 0;
        this.socket.update(this);
    }
    draw() {
        let name = new Sprite(this.stage, SHAPE.text, { text: this.name, font: "10px Arial" }, 100, 20, this.x, this.y - 30)
        this.content = this.animate[this.status].play();
        this.width = lib.caches[this.content].width;
        this.height = lib.caches[this.content].height;
        if(this.status == EStatus.runing){
            this.moveAnimate();
        }
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