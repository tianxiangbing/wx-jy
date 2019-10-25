import {
    JY,
    STATE,
    Stage,
    Title,
    Descript,
    Sprite,
    lib
} from '../src/index';
import { SHAPE } from '../src/sprite';
import Hero, { EDirection } from './js/hero';
import Socket from './js/socket';
import Bg from './js/bg';
import { EAttackType } from './js/attack';
import { EStatus } from './js/hero';
import Rebot from './js/rebot';
const canvas = lib.createCanvas();
const [height, width] = [canvas.height, canvas.width]

//创建舞台
let stage = new Stage(canvas, width, height, '#FFFFFF');
stage.setRealWH(2000,1000);
let title = new Title('弑神', stage);
title.create = (resolve) => {
    lib.write(stage, '弑神')
    resolve();
}
let descript = new Descript(stage)
descript.create = async (resolve) => {
    lib.draw(stage, 'images/descript.png', 0, 0, stage.realWidth, stage.realHeight)
    // await lib.waitMoment(3000);
    //添加开始按钮的Sprite
    // let btn = new Sprite(stage, SHAPE.rect, 'images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    let btn = new Sprite(stage, SHAPE.text, { text: '开始' }, 100, 40, (stage.realWidth - 100) / 2, stage.realHeight / 2 - 20);
    btn.draw();
    lib.addEventListener(stage.canvas, 'touchstart', (e) => {
        console.log(1111)
        btn.touchHits(e, () => {
            console.log(222)
            lib.removeEventListener(stage.canvas, 'touchstart')
            resolve()
        })
    });
}
class Game extends JY {
    frame: number = 0;//帧数
    score = 0;//分数
    life = 10;
    heros: Array<Hero|Rebot> = [];
    rebots:Array<Rebot> = [];
    currentHero: Hero;
    bg: Bg;
    // btn:Sprite;
    reset() {
        this.score = 0;
        this.life = 10;
    }
    newGame() {
        this.stage.style = "#ffffff";
        this.bg = new Bg();
        this.bg.create(this.stage);
        this.reset();
        this.setState(STATE.running);
        this.createHero();
        // this.createRebot();
        //事件绑定
        // lib.addEventListener(this.stage.canvas, 'touchstart', e => {
        //     let { clientX, clientY } = e;
        // });
        this.onEvent();
        
        // this.btn = new Sprite(stage, SHAPE.text, { text: '中' }, 30, 30, stage.realWidth/2, stage.realHeight/2);
    }
    //绑定操作事件
    onEvent() {
        lib.addEventListener(window, 'keyup', e => {
            switch (e.key) {
                case 'ArrowRight':
                case 'd':
                case 'ArrowLeft':
                case 'a':
                case 'ArrowUp':
                case 'w':
                case 'ArrowDown':
                case 's':{
                    this.currentHero.status == EStatus.runing && this.currentHero.stop();
                    break;
                }
            }
        })
        lib.addEventListener(window, 'keydown', e => {
            switch (e.key) {
                case 'ArrowRight':
                case 'd': {
                    this.currentHero.move(EDirection.right);
                    break;
                }
                case 'ArrowLeft':
                case 'a': {
                    this.currentHero.move(EDirection.left);
                    break;
                }
                // case 'ArrowUp':
                // case 'w': {
                //     this.currentHero.move(EDirection.up);
                //     break;
                // }
                // case 'ArrowDown':
                // case 's': {
                //     this.currentHero.move(EDirection.down);
                //     break;
                // }
                case 'j':
                case 'x':{
                    this.currentHero.attack(EAttackType.normal);
                    break;
                }
                case 'k':{
                    this.currentHero.attack(EAttackType.skill);
                    break;
                }
            }
        })
    }
    async running() {
        //先清空场景
        this.stage.clear();
        this.bg.draw();
        //画一个中心点做参照物
        // this.btn.draw();
        // lib.write(this.stage,`${this.stage.center.x},${this.stage.center.y}`,stage.realWidth/2, stage.realHeight/2)
        this.showHeros();
        this.showRebots();
        this.frame++;
        // this.showScore();
        // this.stage.resetDeviation();
    }
    //显示分数信息
    showScore() {
        lib.write(stage, '' + this.life, 10, 20);
        lib.write(stage, '' + this.score, 10, 50);
    }
    //创建角色
    createHero() {
        let stage = this.stage;
        let realPos = lib.transformRelatePosition(stage, {x:stage.width/2,y:stage.height-100})
        let hero = new Hero(stage, SHAPE.circle, '', 21, 57, realPos.x,realPos.y)
        hero.heros = this.heros;
        hero.rebots = this.rebots;
        hero.isOwner = true;
        hero.socket = new Socket();
        hero.socket.conect(u => {
            hero.id = u.uid;
            hero.socket.update(hero);
            document.getElementById('msgcontent').style.display = 'block';
            document.getElementById('send').onclick = () => {
                let input = <HTMLInputElement>document.getElementById('msg');
                if (input.value) {
                    let msg = input.value;
                    hero.socket.talk(msg)
                    input.value = ''
                }
            }
        });
        hero.socket.joinroom(1);
        hero.socket.listen(msg => {
            // debugger
            // console.log(msg)
            switch (msg.type) {
                case 'JOIN': {
                    let { peoples } = msg.body;
                    peoples.forEach(p => {
                        let ishave = false;
                        this.heros.forEach(item => {
                            if (item.id == p.uid) {
                                ishave = true;
                            }
                        });
                        if (!ishave) {
                            let h = new Hero(stage, SHAPE.circle, '', 21, 57, p.x, p.y)
                            h.id = p.uid;
                            this.heros.push(h);
                        }
                    })
                    break;
                }
                case 'update': {
                    this.heros.forEach(p => {
                        if (msg.user == p.id) {
                            p.dataUpdate(msg.body);
                        }
                    })
                    break;
                }
                case 'LEAVE': {
                    this.heros.forEach((item, index) => {
                        let id = msg.body.user;
                        if (item.id == id) {
                            this.heros.splice(index, 1);
                        }
                    })
                    break;
                }
                case 'TALK': {
                    this.heros.forEach((item, index) => {
                        let id = msg.user;
                        if (item.id == id) {
                            item.talk(msg.body)
                        }
                    })
                    break;
                }
                case 'ACTION':{
                    this.heros.forEach((item, index) => {
                        let id = msg.user;
                        if (item.id == id) {
                            if(msg.body.type=='attack'){
                                item.showAttack(msg.body.attackType)
                            }
                        }
                    })
                    break;
                }
                case 'ADDREBOTS':{
                    //没有人，收到npc数据，然后同步创建到舞台
                    this.createRebot();
                    break;
                }
                case 'GETREBOTS':{
                    let fromUser = msg.body.from;
                    //已有人了，通知他给我同步一下npc数据
                    hero.socket.updateRebots({
                            to:fromUser,
                            rebots:this.rebots
                    })
                    break;
                }
            }
        })
        this.currentHero = hero;

        this.heros.push(hero);
    }
    //创建怪兽
    createRebot(){ 
        if(this.rebots.length == 0){
            for(let i =0;i <1;i++){
                let x = +(Math.random()*stage.realWidth).toFixed(0);
                // console.log(x,11111111)
                let realPos = lib.transformRelatePosition(stage, {x:x,y:stage.height-100})
                let rebot = new Rebot(this.stage,SHAPE.rect,'',41,41,x,realPos.y)
                rebot.name="幽灵";
                rebot.heros = this.heros;
                rebot.rebots = this.rebots;
                // rebot.socket = this.currentHero.socket;
                // this.heros.push(rebot);
                this.rebots.push(rebot);
            }
        }
        // this.currentHero.socket.createRebots(this.rebots);
        console.log(this.currentHero.rebots)
        // debugger;
    }
    showRebots(){
        this.rebots.forEach((item,index) => {
            if(!item.visible){
                this.rebots.splice(index,1);
            }else{
                item.draw();
            }
        })
    }
    showHeros() {
        this.heros.forEach((item,index) => {
            if(!item.visible){
                this.heros.splice(index,1);
                if(item == this.currentHero){
                    //如果是当前角色死亡，退出重新进入
                    this.setState(STATE.gameOver);
                }
            }else{
                // item.heros = this.heros;
                item.draw();
            }
        })

        // this.heros.forEach(item => {
        //     // if(item.id != this.currentHero.id && this.currentHero.id){
        //     item.draw();
        //     // }
        // })
        // this.currentHero.draw();
    }
    unEvent(){
        lib.removeEventListener(window, 'keyup');
        lib.removeEventListener(window, 'keydown');
    }
    async gameOver() {
        stage.clear();
        lib.write(stage, '游戏结束！');
        this.unEvent();
        await lib.waitMoment(3000);
        this.reset();
        this.setState(STATE.descript);
    }
}

let mygame = new Game(stage, title, descript);
mygame.resources = [
    'images/role.png',
    'images/btn-start.png',
    'images/descript.png',
    'images/attack.png',
    'images/rebot/ghost.png',
    // 'audio/boom.mp3'
];
for (let i = 1; i <= 15; i++) {
    mygame.resources.push(`images/hero/APimg[${i}].png`);
}
mygame.resources.push(`images/hero/APimg[29].png`);
mygame.resources.push(`images/hero/APimg[30].png`);
mygame.resources.push(`images/hero/APimg[130].png`);
mygame.resources.push(`images/hero/APimg[131].png`);
mygame.resources.push(`images/hero/APimg[180].png`);
mygame.resources.push(`images/hero/APimg[183].png`);
mygame.resources.push(`images/hero/APimg[184].png`);
mygame.resources.push(`images/skill.png`);
//背景图
// for(let i = 212;i <=216;i++){
//     mygame.resources.push(`images/bg/GObj[${i}].png`);
// }
mygame.resources.push(`images/bg/bg.jpg`);
mygame.resources.push(`images/bg/floor.png`);
mygame.setup()