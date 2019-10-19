import { Stage } from ".";
import Adapter from './adpater'
import Sprite from './sprite';
interface Point {
    x: number,
    y: number,
}
let prev = 0;
const lib = {
    //暂停一段时间
    async waitMoment(second: number) {
        return new Promise(resolve => {
            let t = setTimeout(() => {
                clearTimeout(t)
                resolve();
            }, second)
        })
    },
    //两个spite的碰撞检测
    hits: function (oA: Sprite, oB: Sprite, w: number = 0) {
        w = w || 0;
        var bx = false,
            by = false;
        var bw = oB.width - w;
        var aw = oA.width - w;
        var bh = oB.height - w;
        var ah = oA.height - w;
        if (oA.x > oB.x) {
            bx = oA.x - oB.x < bw;
        } else if (oA.x < oB.x) {
            bx = oB.x - oA.x < aw;
        } else {
            bx = true;
        };
        if (oA.y > oB.y) {
            by = oA.y - oB.y < bh;
        } else if (oA.y < oB.y) {
            by = oB.y - oA.y < ah;
        } else {
            by = true;
        };
        return (bx && by);
        //return  (Math.abs(oA.x - oB.x) <=Math.max(oA.width,oB.width) && Math.abs(oA.y - oB.y) <= Math.max(oA.width,oB.width) )
    },
    //显示文字
    write(stage: Stage, text: string, x?: number, y?: number, font: string = "20px Arial", fillStyle: string = '#000000', w: number = stage.width) {
        let context = stage.context;
        context.font = font;
        context.fillStyle = fillStyle;
        let newPos = this.transformPosition(stage, { x, y });
        x = newPos.x;
        y = newPos.y;
        if (x == undefined) {
            x = (stage.width - text.length * 14) / 2;
        }
        if (y == undefined) {
            y = stage.height / 2 - 15;
        }
        var chr = String(text).split("");
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
            if (context.measureText(temp).width < w && context.measureText(temp + (chr[a])).width <= w) {
                temp += chr[a];
            }//context.measureText(text).width  测量文本text的宽度
            else {
                row.push(temp);
                temp = chr[a];
            }
        }
        row.push(temp);

        for (var b = 0; b < row.length; b++) {
            context.fillText(row[b], x, y + (b + 1) * 24);//字体20，间隔24。类似行高
        }
        // context.save();
    },
    //导入图片
    draw(stage: Stage, img: string, dx: number, dy: number, dWidth?: number, dHeight?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number) {
        let context = stage.context;
        // let image = wx.createImage();

        let image = typeof img == 'string' ? this.caches[img] : img;
        let newPos = this.transformPosition(stage, { x: dx, y: dy });
        arguments[2] = newPos.x;
        arguments[3] = newPos.y;
        let args = Array.prototype.slice.call(arguments, 2);
        args.unshift(image);
        // console.log('draw', img)
        // image.onload = ()=>{
        //     context.drawImage.call(context,...args);
        // } 
        // image.src = img;
        context.drawImage.call(context, ...args);
        // context.save();
        // stage.context.translate(stage.center.x,stage.center.y);
    },
    //物理坐标转换成相对舞台的坐标
    transformRelatePosition(stage: Stage, { x, y }):Point {
        //偏移坐标系
        let { realWidth, realHeight, deviation ,width,height} = stage;
        let nx = x+ (realWidth-width)/2+deviation.x;
        let ny = y + (realHeight-height)/2 + deviation.y;
        return {x:nx,y:ny};
    },
    //转换成物理坐标，用来draw
    transformPosition(stage: Stage, { x, y }):Point {
        //偏移坐标系
        let { realWidth, realHeight, deviation } = stage;
        // if(realWidth >stage.width){
        //     stage.context.translate()
        // }
        let width = realWidth / 2 - stage.width / 2;
        let height = realHeight / 2 - stage.height / 2;
        x = x - deviation.x;//偏离中心的值
        y = y - deviation.y;//偏离中心的值
        let newX = x - width;
        let newY = y - height;
        return { x: newX, y: newY };
    },
    //取区间数的随机值
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    caches: {},
    Hcaches: {},//图片镜像
    loadResources(files) {
        // let cache = {};
        let arr = [];
        return new Promise((resolve, reject) => {
            for (let k in files) {
                if (/\.(jpg|gif|png|bmg|jpeg)/.test(files[k])) {
                    //图片的预加载
                    arr.push(new Promise(resolve => {
                        let image = new Image();
                        image.onload = () => {
                            this.caches[files[k]] = image;
                            resolve();
                        }
                        image.src = files[k];
                    })
                    )
                } else
                    if (/\.(mp3|wav|avi|m4a|aac)/.test(files[k])) {
                        //音频
                        arr.push(new Promise(resolve => {
                            let audio = new Audio();
                            audio.addEventListener('canplay', () => {
                                this.caches[files[k]] = audio;
                                resolve();
                            })
                            audio.src = files[k];
                            // console.log(2222)
                        })
                        )
                    }
            }
            return Promise.all(arr).catch((e) => {
                console.log('加载资源出错.')
                reject(e);
            }).then(() => {
                console.log('加载资源完成.')
                resolve();
            })
        })
    },
    //取图片的镜像(横向)
    imageHRevert(imgUrl: string) {
        //从缓存中取出图片
        if (!this.Hcaches[imgUrl]) {
            let img = this.caches[imgUrl];
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
            let newImgUrl = canvas.toDataURL('image/png');
            let newImg = new Image();
            newImg.src = newImgUrl
            this.Hcaches[imgUrl] = newImg;
            ctx = undefined;
            canvas = undefined;
        }
        return this.Hcaches[imgUrl]
    },
    play(url) {
        //播放声音
        let audio = this.caches[url];
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    },
    createCanvas() {
        return Adapter.createCanvas();
    },
    addEventListener(target, type, handle) {
        return Adapter.addEventListener(target, type, handle)
    },
    removeEventListener(target, type, handle?) {
        return Adapter.removeEventListener(target, type, handle)
    },
    dispatchEvent(target, type) {
        return Adapter.dispatchEvent(target, type)
    },
    //在某的范围内
    innerView(rangePos: Point, target: Point, range: number) {
        return (Math.abs(target.x - rangePos.x) <= range
            && Math.abs(target.y - rangePos.y) <= range
        )
    },
    //绘制长方形
    drawRect(stage: Stage, fillStyle: string, width: number, height: number, x: number, y: number) {
        let newPos = this.transformPosition(stage, { x, y });
        let sx = newPos.x;
        let sy = newPos.y;
        let context = stage.context;
        context.fillStyle = fillStyle;
        context.fillRect(sx, sy, width, height);
    },
    //绘制方框
    drawStokeRect(stage: Stage, fillStyle: string, lineWidth: number, width: number, height: number, x: number, y: number) {
        let newPos = this.transformPosition(stage, { x, y });
        let sx = newPos.x;
        let sy = newPos.y;
        let context = stage.context;
        context.strokeStyle = fillStyle;
        context.lineWidth = lineWidth;
        context.strokeRect(sx, sy, width, height);
    },
    //最大最小范围赋值
    getMaxMinVal(max:number,min:number,value:number):number{
        value = Math.max(Math.min(max,value),min);
        return value;
    }
}
let events = ['createCanvas', 'addEventListener', 'removeEventListener', 'dispatchEvent'];
events.forEach(item => {
    lib[item] = Adapter[item].bind(Adapter);
})
export default lib;