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
const canvas = lib.createCanvas();
const [height, width] = [canvas.height, canvas.width]

//创建舞台
let stage = new Stage(canvas, width, height, '#FFFFFF');
let title = new Title('弑神', stage);
title.create = (resolve) => {
    lib.write(stage, '弑神')
    resolve();
}
let descript = new Descript(stage)
descript.create = async (resolve) => {
    lib.draw(stage, 'images/descript.png', 0, 0, stage.width, stage.height)
    // await lib.waitMoment(3000);
    //添加开始按钮的Sprite
    // let btn = new Sprite(stage, SHAPE.rect, 'images/btn-start.png', 100, 40, (width - 100) / 2, height - 40 - 40);
    let btn = new Sprite(stage, SHAPE.text, {text:'开始'}, 100, 40, (width - 100) / 2, height - 40 - 40);
    btn.draw();
    lib.addEventListener(stage.canvas,'touchstart',(e) => {
        console.log(1111)
        btn.touchHits(e,()=>{
            console.log(222)
            lib.removeEventListener(stage.canvas,'touchstart')
            resolve()
        })
    });
}
class Game extends JY {
    frame: number = 0;//帧数
    score = 0 ;//分数
    life = 10;
    heros:Array<Hero>=[];
    currentHero :Hero;
    reset(){
        this.score= 0 ;
        this.life = 10;
    }
    newGame() {
        this.stage.style = "#eeeeee";
        this.reset();
        this.setState(STATE.running);
        this.createHero();
        //事件绑定
        lib.addEventListener(this.stage.canvas,'touchstart',e => {
            console.log(555)
            let { clientX, clientY } = e;
            console.log(clientX, clientY)
        });
        this.onEvent();
    }
    //绑定操作事件
    onEvent(){
        lib.addEventListener(window,'keyup',e =>{
            this.currentHero.stop();
        })
        lib.addEventListener(window,'keydown',e =>{
            switch(e.key){
                case 'ArrowRight':
                case 'd':{
                    this.currentHero.move(EDirection.right);
                    break;
                }
                case 'ArrowLeft':
                case 'a':{
                    this.currentHero.move(EDirection.left);
                    break;
                }
                case 'ArrowUp':
                case 'w':{
                    this.currentHero.move(EDirection.up);
                    break;
                }
                case 'ArrowDown':
                case 's':{
                    this.currentHero.move(EDirection.down);
                    break;
                }
            }
        })
    }
    async running() {
        //先清空场景
        this.stage.clear();
        this.frame++;
        this.showScore();
        this.showHeros();
    }
    //显示分数信息
    showScore(){
        lib.write(stage, ''+this.life,10,20);
        lib.write(stage, ''+this.score,10,50);
    }
    //创建角色
    createHero() {
        let stage = this.stage;
        let hero = new Hero(stage,SHAPE.circle,'images/role.png',50,100,stage.width/2-25,stage.height-100)
        hero.socket = new Socket();
        hero.socket.conect(u=>{
            hero.name= u.uid;
            hero.socket.update(hero);
            document.getElementById('msgcontent').style.display= 'block';
            document.getElementById('send').onclick=()=>{
                if(document.getElementById('msg').value){
                    let msg = document.getElementById('msg').value;
                    hero.socket.talk(msg)
                    document.getElementById('msg').value = ''
                }
            }
        });
        hero.socket.joinroom(1);
        hero.socket.listen(msg=>{
            // debugger
            // console.log(msg)
            switch(msg.type){
                case 'JOIN':{
                    let {peoples} = msg.body;
                    peoples.forEach(p=>{
                        let h = new Hero(stage,SHAPE.circle,'images/role.png',50,100,p.x,p.y) 
                        h.name = p.uid;
                        this.heros.push(h);
                    })
                    break;
                }
                case 'update':{
                    this.heros.forEach(p=>{
                        if(msg.user == p.name){
                            let {x,y} = msg.body;
                            p.x = x;
                            p.y = y;
                        }
                    })
                    break;
                }
                case 'LEAVE':{
                    this.heros.forEach((item,index)=>{
                        let id = msg.body.user;
                        if(item.name == id){
                            this.heros.splice(index,1);
                        }
                    })
                    break;
                }
                case 'TALK':{
                    this.heros.forEach((item,index)=>{
                        let id = msg.user;
                        if(item.name == id){
                            item.talk(msg.body)
                        }
                    })
                    break;
                }
            }
        })
        this.currentHero = hero;
        // this.heros.push(hero);
    }
    showHeros(){
        this.heros.forEach(item=>{
            item.draw();
        })
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
    'audio/boom.mp3'
];
mygame.setup()