import { Sprite } from "../../src";

/**
 * 攻击
 */

export enum attackType {
    normal,
    skill
}
interface ISpeed{
    x:number,
    y:number
}
export default class Attack extends Sprite{
    atype: attackType;
    speed:ISpeed;
}