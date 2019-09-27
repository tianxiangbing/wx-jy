//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
import { Stage } from '.';
//描述设计
export default class Descript  implements  IScreen{
    constructor(public stage:Stage) {
        console.log(arguments)
    }
    create(resolve:Function) {
       wx.onTouchStart(() => {
            console.log('touch...')
            wx.offTouchStart();
            resolve()
        })
    }
    remove(){
        this.stage.clear();
    }
}