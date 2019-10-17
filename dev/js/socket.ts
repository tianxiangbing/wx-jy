import Hero from "./hero";
import * as io from 'socket.io-client';
/**
 * 消息推送的处理
 */
class Socket {
    socket: any;
    constructor() {
        this.socket = io('http://localhost:8099');
    }
    conect(func) {
        this.socket.on('connect', (c) => {
            console.log('connect ...', this.socket.id);
            this.socket.on('user', u => {
                func(u);
                console.log('用户ID', u.uid)
            });
        });
    }
    talk(msg){
        this.socket.emit('message',{type:'TALK',body:msg})
    }
    listen(func) {
        this.socket.on('message', msg => {
            console.log('message:', msg)
            func(msg)
        });
    }
    joinroom(num) {
        //加入房间号为1的房间
        this.socket.emit('join', num);
    }
    update(user:Hero){
        let {x,y,status,direction,name} =  user;
        this.socket.emit('message',{type:'update',body:{x,y,status,direction,name}})
    }
}
export default Socket;