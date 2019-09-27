//描述设计
//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
import { Stage } from '.';
import lib from './lib';

export default class Title  implements  IScreen{
    constructor(public title:string,private stage:Stage) {
        console.log(arguments)
    }
    create(resolve) {
        lib.write(this.stage,this.title)
        lib.waitMoment(3000);
        resolve();
    }
    remove(){
        this.stage.clear();
    }
}