import { Sprite } from "../../src";
import { SHAPE } from "../../src/sprite";
import Hero, { EDirection } from "./hero";
import lib from '../../src/lib';
import { EStatus } from './hero';
import Rebot from "./rebot";

/**
 * 攻击类型,枚举所有攻击的形式
 */

export enum EAttackType {
    normal,
    skill
}
interface ISpeed {
    x: number,
    y: number
}
export default class Attack extends Sprite {
    speed: ISpeed = { x: 0, y: 0 };
    speedValue: number;
    distance: number;//攻击距离
    start: ISpeed = { x: 0, y: 0 };//开始攻击的位置
    second: number = 10;//冷却时间 帧数
    owner:Hero;//所有者
    aggressivity:number=1;//攻击加成，普通攻击一倍   
    manaConsume:number=0;//法力消耗，普通攻击0消耗
    constructor(stage,hero:Hero, public atype: EAttackType, public x: number, public y: number, public direct: EDirection) {
        super(stage, SHAPE.rect, '', 20, 20)
        this.owner= hero;
        switch (atype) {
            case EAttackType.normal: {
                this.content = 'images/attack.png';
                this.speedValue = 15;
                this.distance = 600;
                this.second = 30;
                this.start = { x, y };
                break;
            }
            case EAttackType.skill: {
                this.content = 'images/attack.png';
                this.speedValue = 10;
                this.width = 40;
                this.height = 40;
                this.y -= 20;
                this.distance = 700;
                this.second = 140;
                this.aggressivity = 2;//技能2倍攻击力
                this.start = { x, y };
                this.manaConsume = 50//消蓝
                break;
            }
        }
        if (direct == EDirection.left) {
            this.x -= this.width;
        }
        this.formatSpeed();
    }
    formatSpeed() {
        switch (this.direct) {
            case EDirection.left: {
                this.speed = { x: -this.speedValue, y: 0 };
                break;
            }
            case EDirection.right: {
                this.speed = { x: this.speedValue, y: 0 };
                break;
            }
            case EDirection.up: {
                this.speed = { y: -this.speedValue, x: 0 };
                break;
            }
            case EDirection.down: {
                this.speed = { y: this.speedValue, x: 0 };
                break;
            }
        }
    }
    draw() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        //目前只算x轴的距离 
        if (Math.abs(Math.abs(this.x) - Math.abs(this.start.x)) > this.distance) {
            this.visible = false;
        }
        super.draw();
    }
    checkHits(heros: Array<Hero>,rebots:Array<Rebot>) {
       this.toHits(heros);
       this.toHits(rebots);
    }
    toHits(heros:Array<Hero>){
        heros.forEach(hero => {
            if (!hero.isDie && hero.id!=this.owner.id && lib.hits(this,hero)) {
                // console.log(hero.name, 'kill');
                //受到的伤害=发起攻击的攻击力*技能加成
                let aggressivity = this.owner.aggressivity *this.aggressivity;
                hero.setHit(aggressivity);
                this.visible=false;
                hero.checkLife();
            }
        });
    }
}