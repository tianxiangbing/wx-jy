import { Sprite } from "../../src";
import { SHAPE } from "../../src/sprite";
import { EDirection } from "./hero";

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
    speed: ISpeed;
    speedValue: number;
    distance: number;//攻击距离
    start: ISpeed;//开始攻击的位置
    constructor(stage, public atype: EAttackType, public x: number, public y: number, public direct: EDirection) {
        super(stage, SHAPE.rect)
        switch (atype) {
            case EAttackType.normal: {
                this.content = 'images/attack.png';
                this.speedValue = 10;
                this.distance = 200;
                this.start = { x, y };
                break;
            }
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
        if (Math.abs(this.x) - Math.abs(this.start.x)) {
            this.visible = false;
        }
        super.draw();
    }
}