import { Stage } from ".";
import Adapter from './adpater'
const lib =  {
    //暂停一段时间
    async waitMoment(second: number) {
        return new Promise(resolve => {
            let t = setTimeout(() => {
                clearTimeout(t)
                resolve();
            }, second)
        })
    },
    //显示文字
    write(stage: Stage, text: string, x?: number, y?: number, font: string = "20px Arial", fillStyle: string = '#000000',w:number=stage.width) {
        let context = stage.context;
        context.font = font;
        context.fillStyle = fillStyle;
        if (x == undefined) {
            x = (stage.width - text.length * 14) / 2;
        }

        if (y == undefined) {
            y = stage.height / 2 - 15;
        }
        // console.log(text)
        var chr = String(text).split("");
        var temp = "";              
        var row = [];
        for(var a = 0; a < chr.length; a++){
            if( context.measureText(temp).width < w && context.measureText(temp+(chr[a])).width <= w){
                temp += chr[a];
            }//context.measureText(text).width  测量文本text的宽度
            else{
                row.push(temp);
                temp = chr[a];
            }
        }
        row.push(temp);
    
        for(var b = 0; b < row.length; b++){
            context.fillText(row[b],x,y+(b+1)*24);//字体20，间隔24。类似行高
        }
    },
    //导入图片
    draw(stage: Stage, img: string, dx: number, dy: number, dWidth?: number, dHeight?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number) {
        let context = stage.context;
        // let image = wx.createImage();
        let image = this.caches[img];
        let args = Array.prototype.slice.call(arguments, 2);
        args.unshift(image);
        // console.log('draw', img)
        // image.onload = ()=>{
        //     context.drawImage.call(context,...args);
        // } 
        // image.src = img;
        context.drawImage.call(context, ...args);
    },
    //取区间数的随机值
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    caches: {},
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
    play(url) {
        //播放声音
        let audio = this.caches[url];
        audio.pause();
        audio.currentTime =0 ;
        audio.play();
    },
    createCanvas(){
        return Adapter.createCanvas();
    },
    addEventListener(target,type,handle){
        return Adapter.addEventListener(target,type,handle)
    },
    removeEventListener(target,type,handle?){
        return Adapter.removeEventListener(target,type,handle)
    },
    dispatchEvent(target,type){
        return Adapter.dispatchEvent(target,type)
    }
}
let events = ['createCanvas','addEventListener','removeEventListener','dispatchEvent'];
events.forEach(item=>{
    lib[item] = Adapter[item].bind(Adapter);
})
export default lib;