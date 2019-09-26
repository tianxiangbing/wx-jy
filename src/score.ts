//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Score implements IScreen {
    elem: any;
    right: string;
    top: string;
    constructor(public text?: string) {
        console.log(arguments)
    }
    create(callback?: Function) {
        this.elem = document.createElement('div');
        this.elem.className = "score";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        this.elem.style.right = this.right || '10px';
        this.elem.style.top = this.top || '10px';
        return this.elem;
    }
    change(text: string) {
        this.text = text;
        this.elem.innerHTML = this.text;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}