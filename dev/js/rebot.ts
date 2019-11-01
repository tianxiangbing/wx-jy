/*
 * @Author: your name
 * @Date: 2019-10-21 10:22:42
 * @LastEditTime: 2019-11-01 17:32:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ts\dev\js\rebot.ts
 */
import Hero, { EStatus,EDirection } from './hero';
import Animate from '../../src/animate';
import { lib } from '../../src';
import Attack, { EAttackType } from './attack';
/**
 * 机器人
 */
export default class Rebot extends Hero {
    displayName = "Rebot";
    speedValue = 2;
    experience=10;//经验值
    constructor(a1, a2, a3, a4, a5, a6, a7) {
        super(a1, a2, a3, a4, a5, a6, a7);
        this.content = 'images/rebot/ghost.png';
        this.animate[EStatus.standup] = new Animate([
            // { content: 'images/rebot/ghost.png', w: 41, h: 41 }
            // { content: 'images/role.png', w: 19, h: 60 }
        ], null, this);
        this.animate[EStatus.runing] = new Animate([
            // { content: 'images/rebot/ghost.png', w: 41, h: 41 }
        ], null, this);
        this.blue = null;
        this.status = EStatus.runing;
        this.direction = EDirection.left;
    }
    //判断是否遇到hero，如果遇到就攻击它
    checkHits() {
        this.heros.forEach(item => {
            if (lib.hits(this, item)) {
                //遇到了,干
                this.attack(EAttackType.normal, item);
            }
        })
    }
    showAttack(attackType: EAttackType, target?: Hero) {
        debugger
        let a = new Attack(this.stage, this, attackType, this.x + this.direction * this.width, this.y + this.height / 3, this.direction);
        if (a.manaConsume <= this.mana) {
            this.status = EStatus.attack;
            this.killSecond[attackType] = a.second;//当前英雄的技能冷却时间;   
            //打一下    
            this.animate[this.status] = new Animate([
                {
                    y: 1
                }
            ], () => {
                // this.attacking = false;
                // this.status = EStatus.standup;
                // this.mana = lib.getMaxMinVal(this.blue.max, 0, this.mana - a.manaConsume);//费蓝
                // // this.blue.setValue(-a.manaConsume);
                // // this.mana+=-a.manaConsume;
                // // console.log(this.x,this.x +this.direction* this.width+this.direction*5)
                // this.attackList.push(a);
            }, this);
            this.animate[this.status].speed = 2;
            this.animate[this.status].loopNum = 20;
            this.animate[this.status].overCallback = () => {
                this.attacking = false;
                this.status = EStatus.standup;
                //扣血
                target.life -= this.aggressivity;
                target.checkLife();
                this.y = this.y -20;
            }
        } else {
            this.killSecond[attackType] = 0
        }
    }
    draw() {
        if (this.x == 0) {
            this.direction = EDirection.right;
        }
        if (this.x == this.stage.realWidth - this.width) {
            this.direction = EDirection.left;
        }
        this.checkHits();
        super.draw();
    }
}