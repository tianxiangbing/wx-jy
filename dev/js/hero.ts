/**
 * hero
 */
import {
    Stage,
    Sprite,
    lib
} from '../../src/index';
import Attack, { EAttackType } from './attack';
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
    attack = 'attack'
}
export default class Hero extends Sprite {
    speed: ISpeed = { x: 0, y: 0 };
    speedValue: number = 20;
    name: string = Math.random().toString().split('.')[1];
    id: string;//由ws推送过来的唯一标识
    socket: Socket;
    msg = '';
    timer: number;
    content = 'images/role.png';
    // content = 'images/hero/APimg[2].png';
    status: EStatus = EStatus.standup;
    animate = {};
    frame = 0;
    direction: EDirection = EDirection.right;
    isOwner = false;//判断是不是自己
    attackList: Array<Attack> = [];//攻击元素的集合
    heros: Array<Hero>;
    nameSprite: Sprite;
    constructor(a1, a2, a3, a4, a5, a6, a7) {
        super(a1, a2, a3, a4, a5, a6, a7)
        this.animate[EStatus.runing] = new Animate([
            { content: 'images/hero/APimg[10].png', w: 20, h: 55 },
            { content: 'images/hero/APimg[11].png', w: 38, h: 57 },
            { content: 'images/hero/APimg[12].png', w: 49, h: 54 },
            { content: 'images/hero/APimg[13].png', w: 43, h: 57 }
        ]);
        this.animate[EStatus.runing].speed = 10;
        this.animate[EStatus.standup] = new Animate([
            // { content: 'images/hero/APimg[2].png', w: 19, h: 60 }
            { content: 'images/role.png', w: 19, h: 60 }
        ]);
        let nw = String(this.name).length * 10;
        this.nameSprite = new Sprite(this.stage, SHAPE.text, { text: `(${this.x},${this.y})`, font: "10px Arial" }, nw, 20, this.x - 10, this.y - 30)
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
        if (this.frame == 10) {
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
            this.x = Math.min(Math.max(0, this.x), this.stage.realWidth - this.width)
            let maxy = this.stage.realHeight / this.stage.realWidth * 440 - this.height;
            this.y = Math.min(Math.max(maxy, this.y), this.stage.realHeight - this.height)
            if (this.isOwner) {
                let deviation = this.stage.deviation;
                // let inView = lib.innerView(this.stage.RelativeCenter,this,40);
                // if(inView){
                deviation = { x: deviation.x + this.speed.x, y: deviation.y + this.speed.y }
                this.stage.setDeviation(deviation, this);
                this.draw()
                // }
            }
        }
        this.frame++;
    }
    dataUpdate(data) {
        let { x, y, status, direction, name } = data;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.status = status;
        this.name = name;
    }
    stop() {
        this.status = EStatus.standup;
        this.speed.x = 0;
        this.speed.y = 0;
        this.frame = 0;
        this.socket.update(this);
    }
    draw() {
        if (this.status == EStatus.runing) {
            this.moveAnimate();
        }

        let play = this.animate[this.status].play();
        this.content = play.content;
        this.width = play.w;
        this.height = play.h;
        this.nameSprite.y = this.y - 30;
        this.nameSprite.x = this.x;
        this.nameSprite.content.text = `111`;
        this.nameSprite.draw();
        let oldPos = { x: this.x, y: this.y };
        if (EDirection.left == this.direction) {
            // let realPos = lib.transformPosition(this.stage, { x: this.x, y: this.y });
            // console.log(realPos)
            //翻转2x+width
            // this.stage.context.translate(2 * realPos.x + this.width, 0);
            // this.x = this.stage.realWidth - this.x;
            // this.stage.context.scale(-1, 1);
            this.content = lib.imageHRevert(this.content);
            // super.draw();
            // this.stage.context.setTransform(1, 0, 0, 1, 0, 0);
            // } else {
            // super.draw();
        }
        // super.draw();
        this.x = oldPos.x;
        this.y = oldPos.y;
        this.msg && this.showMsg();
        //显示攻击效果
        this.attackList.forEach((item, index) => {
            if (!item.visible) {
                this.attackList.splice(index, 1);
            } else {
                item.draw();
                item.checkHits(this.heros);
            }
        })
    }
    //攻击
    attack(attackType: EAttackType) {
        this.showAttack(attackType);
        this.socket.attack({ x: this.x, y: this.y, attackType: attackType, direction: this.direction });
    }
    showAttack(attackType: EAttackType) {
        let a = new Attack(this.stage, attackType, this.x, this.y + this.height / 2, this.direction);
        this.attackList.push(a);
    }
}