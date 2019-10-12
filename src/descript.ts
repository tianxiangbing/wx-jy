//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
import { Stage } from '.';
//描述设计
export default class Descript  implements  IScreen{
    constructor(public stage:Stage) {
        console.log(arguments)
    }
    create(resolve:Function) {
       this.stage.canvas.addEventListener('touchstart',() => {
            console.log('touch...')
            // this.stage.canvas.removeEventListener('touchstart');
            resolve()
        })
    }
    remove(){
        this.stage.clear();
    }
}