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
const canvas = lib.createCanvas();
const [height, width] = [canvas.height, canvas.width]

//创建舞台
let stage = new Stage(canvas, width, height, '#FFFFFF');
stage.realWidth = 1000;
stage.realHeight = 1000;
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
    heros: Array<Hero> = [];
    currentHero: Hero;
    bg: Bg;
    btn:Sprite;
    btn2:Sprite;
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
        //事件绑定
        lib.addEventListener(this.stage.canvas, 'touchstart', e => {
            console.log(555)
            let { clientX, clientY } = e;
            console.log(clientX, clientY)
        });
        this.onEvent();
        
        this.btn = new Sprite(stage, SHAPE.text, { text: '中' }, 30, 30, 500, 500);
    }
    //绑定操作事件
    onEvent() {
        lib.addEventListener(window, 'keyup', e => {
            this.currentHero.stop();
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
                case 'ArrowUp':
                case 'w': {
                    this.currentHero.move(EDirection.up);
                    break;
                }
                case 'ArrowDown':
                case 's': {
                    this.currentHero.move(EDirection.down);
                    break;
                }
            }
        })
    }
    async running() {
        //先清空场景
        this.stage.clear();
        // this.stage.context.translate(this.stage.deviation.x, this.stage.deviation.y);
        // this.bg.draw();
        //画一个中心点做参照物
        this.btn.draw();
        this.showHeros();
        this.btn2.draw();
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
        let hero = new Hero(stage, SHAPE.circle, '', 21, 57, 500, 500)
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
        // let h = new Hero(stage, SHAPE.circle, '', 21, 57, 500, 400)
        // h.id = "test";
        // h.name = "test";
        // this.heros.push(h);
        this.btn2 = new Sprite(stage, SHAPE.text, { text: '心' }, 30, 30, 500, 400);
        hero.socket.joinroom(1);
        hero.socket.listen(msg => {
            // debugger
            // console.log(msg)
            switch (msg.type) {
                case 'JOIN': {
                    let { peoples } = msg.body;
                    peoples.forEach(p => {
                        // if(p.uid == this.currentHero.name){
                        //     this.heros.push(this.currentHero);
                        // }else{
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
                        // }
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
            }
        })
        this.currentHero = hero;

        this.heros.push(hero);
    }
    showHeros() {
        this.heros.forEach(item => {
            item.draw();
        })

        // this.heros.forEach(item => {
        //     // if(item.id != this.currentHero.id && this.currentHero.id){
        //     item.draw();
        //     // }
        // })
        // this.currentHero.draw();
    }
    async gameOver() {
        stage.clear();
        lib.write(stage, '游戏结束！');
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
    // 'audio/boom.mp3'
];
for (let i = 1; i <= 15; i++) {
    mygame.resources.push(`images/hero/APimg[${i}].png`);
}
//背景图
// for(let i = 212;i <=216;i++){
//     mygame.resources.push(`images/bg/GObj[${i}].png`);
// }
mygame.resources.push(`images/bg/bg.jpg`);
mygame.setup()