import Hero from './hero';
import { EStatus } from './hero';
import Animate from '../../src/animate';
/**
 * 机器人
 */
export default class Rebot extends Hero{
    constructor(a1, a2, a3, a4, a5, a6, a7) {
        super(a1, a2, a3, a4, a5, a6, a7);
        this.animate[EStatus.standup] = new Animate([
            { content: 'images/rebot/ghost.png', w: 41, h: 41 }
            // { content: 'images/role.png', w: 19, h: 60 }
        ],null,this);
        this.blue=null;
    }
}