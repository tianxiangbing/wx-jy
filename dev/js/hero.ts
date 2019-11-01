/*
 * @Descripttion: 
 * @Author: tianxiangbing
 * @Date: 2019-10-12 14:06:56
 * @LastEditTime: 2019-11-01 16:49:44
 * @github: https://github.com/tianxiangbing
 */
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
import Rebot from './rebot';

export enum EDirection {
    left = 0,
    right = 1,
    up = 0.1,
    down = 0.2
}
interface ISpeed {
    x: number,
    y: number
}
export enum EStatus {
    standup,
    runing = 'runing',
    jump = 'jump',
    attack = 'attack',
    hit = 'hit',//被击中
    die='die',//死亡
    lieDown ='lieDown',//躺着
}
export enum EMotionState{
    standup = 'standup',
    runing ='runing',
    jump = 'jump',
}
//血类型
enum EBoodType {
    red = 'red',
    blue = 'blue'
}
class Blood {
    height = 10;
    width = 10;
    //max:最大值
    //current:当前值
    //width:宽度
    constructor(public stage: Stage, public type: EBoodType, public x: number, public y: number, public max: number, public current: number, public roleWidth: number) {
        this.width = this.roleWidth * 3;
    }
    // setValue(v){
    //     this.current+=v;
    //     this.current = Math.max(0, Math.min(this.max,this.current))
    // }
    draw(x, y, v) {
        this.current = v;
        this.x = x - Math.abs(this.roleWidth - this.width) / 2;
        this.y = y - 30;
        lib.drawStokeRect(this.stage, this.type, 2, this.width, this.height, this.x, this.y);
        //计算血量的长度，
        //this.max/this.width = this.current/x 
        let bloodWidth = this.current / (this.max / this.width);
        lib.drawRect(this.stage, this.type, bloodWidth, this.height, this.x, this.y);
        lib.write(this.stage, `${this.current}/${this.max}`, this.x + 10, this.y - 15, '12px', '#DEDEFE')
    }
}

export default class Hero extends Sprite {
    displayName="Hero";
    speed: ISpeed = { x: 0, y: 0 };
    speedValue: number = 3;
    name: string = Math.random().toString().split('.')[1];
    id: string = Math.random().toString().split('.')[1];;//由ws推送过来的唯一标识
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
    heros: Array<Hero>=[];//
    rebots:Array<Rebot>=[];
    nameSprite: Sprite;
    killSecond = {}//技能冷却时间 
    blood: Blood;//血条
    blue: Blood;//蓝条
    mana: number = 100;//法力
    life: number = 100;//血量
    isDie= false;//是否已死亡
    attacking: boolean = false;//是否正在攻击中
    aggressivity: number = 20;//攻击力量，普通攻击的
    died:boolean = false;//是否已死亡，
    level:number = 1;//英雄等级，关联计算血量、法力、攻击力,以递增1.5倍
    experience:number=100;//升级所需要经验值，前一级的两倍
    /**
     * @desc: 当前经验值
     * @param {type} 
     * @return: 
     */    
    experienceValue=50;
    constructor(a1, a2, a3, a4, a5, a6, a7) {
        super(a1, a2, a3, a4, a5, a6, a7)
        this.animate[EStatus.runing] = new Animate([
            { content: 'images/hero/APimg[10].png', w: 20, h: 55 },
            { content: 'images/hero/APimg[11].png', w: 38, h: 57 },
            { content: 'images/hero/APimg[12].png', w: 49, h: 54 },
            { content: 'images/hero/APimg[13].png', w: 43, h: 57 }
        ],null,this);
        this.animate[EStatus.runing].speed = 8;
        this.animate[EStatus.standup] = new Animate([
            // { content: 'images/hero/APimg[2].png', w: 19, h: 60 }
            { content: 'images/role.png', w: 19, h: 60 }
        ],null,this);
        //被击中
        this.animate[EStatus.hit] = new Animate([
            { content: 'images/hero/APimg[130].png', w: 20, h: 55 },
            // { content: 'images/hero/APimg[131].png', w: 38, h: 57 }
        ], () => {
            this.status = EStatus.standup;
        },this)
        this.animate[EStatus.hit].loopNum = 10;
        this.animate[EStatus.die] = new Animate([
            {content:'images/hero/APimg[180].png',w:58,h:15,y:1}
        ],()=>{
        },this);
        this.animate[EStatus.die].speed=1;
        this.animate[EStatus.die].overCallback=()=>{
            //躺尸
            this.status = EStatus.lieDown;
        }
        this.animate[EStatus.die].loopNum =10;
        this.animate[EStatus.lieDown] = new Animate([
            {content:'images/hero/APimg[184].png',w:58,h:15}
        ],(a)=>{
            // this.visible = false;
        },this);
        this.animate[EStatus.lieDown].loopNum =5;
        this.animate[EStatus.lieDown].overCallback=()=>{
            this.visible = false;
        }
        this.animate[EStatus.lieDown].speed =10;
        let nw = String(this.name).length * 5;
        this.nameSprite = new Sprite(this.stage, SHAPE.text, { text: this.id, font: "10px Arial" }, nw, 20, this.x - 10, this.y - 30)
        this.nameSprite.offsetX = Math.abs(this.nameSprite.width - this.width) / 2;
        //初始化血条
        this.blood = new Blood(this.stage, EBoodType.red, this.x, this.y - 10, 100, this.life, this.width);
        //初始化蓝条
        this.blue = new Blood(this.stage, EBoodType.blue, this.x, this.y, 100, this.mana, this.width);
    }
    //获取攻击力 ,基础攻击力100*Math.Power(1.5,x)
    getAggressivity(){
        return this.aggressivity * Math.pow(1.5,this.level-1);
    }
    /**
     * @desc: 获取经验值,怪物的经验为它当前等级的2倍
     */
    getExp(){
        return this.experience * Math.pow(2,this.level-1);
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
        this.status = EStatus.runing;
        if(this.direction !== direction){
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
            this.draw();
            this.socket.update(this);
        }
    }
    moveAnimate() {
        let direction = this.direction;
        // if (this.frame == 10) {
        //     this.frame = 1;
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
            // this.draw()
            // }
        }
        // }
        // this.frame++;
    }
    dataUpdate(data) {
        let { x, y, status, direction, name, id } = data;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.status = status;
        this.name = name;
        this.id = id
        this.nameSprite.width = String(this.name).length * 5;
        this.nameSprite.content.text = this.name;
    }
    stop() {
        this.status = EStatus.standup;
        this.speed.x = 0;
        this.speed.y = 0;
        // this.frame = 0;
        this.socket.update(this);
    }
    draw() {
        this.frame++;
        //自动回蓝、回血
        if(!this.died){
            if (this.frame % 100 == 0) {
                this.blue ? this.mana = lib.getMaxMinVal(this.blue.max, 0, this.mana + 1):null;
                this.life = lib.getMaxMinVal(this.blood.max, 0, this.life + 1);
            }
            if (this.status == EStatus.runing) {
                this.moveAnimate();
            }
        }
        let play = this.animate[this.status].play();
        this.content = play.content;
        this.width = play.w;
        this.height = play.h;
        //动画偏移量
        this.x =  play.x;
        this.y = play.y;
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
        //名字
        this.nameSprite.y = this.y - 30;
        this.nameSprite.x = this.x - this.nameSprite.offsetX;
        this.nameSprite.draw();
        //绘血量
        this.blood.draw(this.x, this.y - 12, this.life);
        this.blue&&this.blue.draw(this.x, this.y, this.mana)
        super.draw();
        this.x = oldPos.x;
        this.y = oldPos.y;
        this.msg && this.showMsg();
        this.killSecond[EAttackType.normal] > 0 && this.killSecond[EAttackType.normal]--;
        this.killSecond[EAttackType.skill] > 0 && this.killSecond[EAttackType.skill]--;
        // lib.write(this.stage, `攻击1的冷却时间 ：${this.killSecond[EAttackType.normal]}`, this.x, this.y - 55)
        // lib.write(this.stage, `攻击2的冷却时间 ：${this.killSecond[EAttackType.skill]}`, this.x, this.y - 65)
        //显示攻击效果
        this.attackList.forEach((item, index) => {
            // this.killSecond[item.atype]--;
            if (!item.visible) {
                this.killSecond[item.atype] = 0;
                this.attackList.splice(index, 1);
            } else {
                item.draw();
                item.checkHits(this.heros,this.rebots);
            }
        })
        //显示经验、等级信息
        if(this.isOwner){
            this.drawInfo();
        }
    }
    /**
     * @desc: 显示经验、等级信息
     * @param {type} 
     * @return: 
     */
    drawInfo(){
        let w = this.stage.width;
        lib.drawStokeRect(this.stage,'#999999', 1, w, 8, 0,0,true);
        lib.drawRect(this.stage,'#dddddd', w/this.getExp()*this.experienceValue, 6, 1,1,true);
        lib.write(this.stage,`${this.experienceValue}/${this.getExp()}`,this.stage.width/2-10,0,"8px",'#333',this.stage.width,true)
    }
    //攻击
    attack(attackType: EAttackType,target?:Hero) {
        if ((!this.killSecond[attackType] || this.killSecond[attackType] <= 0)) {
            // if(this.killSecond[attackType]>0)debugger;
            // console.log(this.killSecond[attackType],!this.killSecond[attackType] )
            this.showAttack(attackType,target);
            if(this.isOwner){
                this.socket.attack({ x: this.x, y: this.y, attackType: attackType, direction: this.direction });
            }
        }
    }
    //添加被击中的效果
    setHit(aggressivity) {
        this.status = EStatus.hit;
        this.life =  lib.getMaxMinVal(this.blood.max, 0, this.life - aggressivity);
    }
    //判断生命值
    checkLife(){
        if(this.life <=0){
            //死亡
            this.die();
        }
    }
    /**
     * @desc: 检查是否升级,计算经验值是否超过当前所需要的经验
     * @param {type} 
     * @return: 
     */
    checkLevel(){
        let needExp = this.getExp();
        if(this.experienceValue >= needExp){
            //升级
            this.level ++; 
            this.experienceValue = 0;//经验清0
        }
    }
    //死亡
    die(){
        this.died = true;
        this.status = EStatus.die;
    }
    showAttack(attackType: EAttackType,target?:Hero) {
        let a = new Attack(this.stage, this, attackType, this.x + this.direction * this.width, this.y + this.height / 3, this.direction);
        if (a.manaConsume <= this.mana) {
            this.status = EStatus.attack;
            this.killSecond[attackType] = a.second;//当前英雄的技能冷却时间;       
            this.animate[this.status] = new Animate([
                { content: 'images/hero/APimg[29].png', w: 27, h: 60 },
                { content: 'images/hero/APimg[30].png', w: 24, h: 55 }
            ], () => {
                this.attacking = false;
                this.status = EStatus.standup;
                this.mana = lib.getMaxMinVal(this.blue.max, 0, this.mana - a.manaConsume);//费蓝
                // this.blue.setValue(-a.manaConsume);
                // this.mana+=-a.manaConsume;
                // console.log(this.x,this.x +this.direction* this.width+this.direction*5)
                this.attackList.push(a);
            },this);
        } else {
            this.killSecond[attackType] = 0
        }
    }
}