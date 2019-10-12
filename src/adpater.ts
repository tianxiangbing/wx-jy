/**
 * 对h5和wx进行兼容处理
 */
import './weapp-adapter';
let iswx = false;
if (!window || window.hasOwnProperty('wx')) {
    iswx = true;
}
let isMobile = true;
if (navigator.userAgent.indexOf('Mobile') == -1) {
    isMobile = false;
}
let events = {};

const adapter = {
    // showShareMenu: () => { },
    createCanvas: () => {
        if (iswx) {
            return window['canvas'];//全局创建的canvas
        } else {
            let canvas = document.createElement('canvas');
            canvas.height = document.documentElement.clientHeight;
            canvas.width = document.documentElement.clientWidth;
            canvas.style.position = 'absolute';
            canvas.style.top = "0";
            canvas.style.left = "0";
            document.body.append(canvas);
            return canvas;
        }
    },
    eventMap: {
        touchstart: 'click',
        touchmove: 'mousemove'
    },
    wrapEventType(type) {
        if (isMobile) {
            return type;
        } else {
            return this.eventMap[type] || type;
        }
    },
    addEventListener(target, type, listener) {
        // console.log(777)
        if (iswx) {
            target.addEventListener(type, listener);
        } else {
            type = this.wrapEventType(type);
            if (!events[type]) {
                events[type] = []
                target.addEventListener(type, this.handle.call(this,type), false);
            }
            events[type].push(listener);
        }
    },
    handle(type) {
        return (event) => {
            let listeners = events[type];
            console.log(3333,listeners)
            for (var i = 0; i < listeners.length; i++) {
                if (!isMobile) {
                    event.touches = [event];
                }
                listeners[i](event)
            }
        }
    },
    removeEventListener(target, type, listener) {
        if (iswx) {
            target.removeEventListener(type, listener);
        } else {
            type = this.wrapEventType(type);
            var listeners = events[type]
            if (listeners && listeners.length > 0) {
                for (var i = listeners.length; i--; i > 0) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1)
                        break
                    }
                }
            }
            if (listeners == 0 || !listener) {
                console.log(4444)
                events[type] = [];
                // target.removeEventListener(type, this.handle(type), false);
            }
        }
    },
    dispatchEvent(target, event) {
        if (iswx) {
            target.dispatchEvent(event);
        } else {
            let type = event.type;
            var listeners = events[type]
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](event)
                }
            }
        }
    }
    // createImage() {
    //     let img = new Image();
    //     return img;
    // },
    // createInnerAudioContext() {
    //     let audio = new Audio();
    //     let f = null;
    //     let newProps = {
    //         onCanplay(t) {
    //             f = t;
    //         }
    //     }
    //     audio.oncanplay = (e) => {
    //         f();
    //     }
    //     return Object.assign(audio, newProps)
    // }
}

export default adapter;