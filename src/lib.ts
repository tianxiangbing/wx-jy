import { Stage } from ".";

export default {
    /*
    * 暂停一段时间
    */
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
    write(stage: Stage, text: string, x?: number, y?: number, font: string = "14px Arial", fillStyle: string = '#000000') {
        let context = stage.context;
        context.font = font;
        context.fillStyle = fillStyle;
        if (x == undefined) {
            x = (stage.width - text.length * 14) / 2;
        }

        if (y == undefined) {
            y = stage.height / 2 - 15;
        }

        context.fillText(text, x, y)
    },
    //导入图片
    draw(stage: Stage, img: string, dx: number, dy: number, dWidth?: number, dHeight?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number) {
        let context = stage.context;
        // let image = wx.createImage();
        let image = this.caches[img];
        let args = Array.prototype.slice.call(arguments, 2);
        args.unshift(image);
        console.log('draw',img)
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
        return new Promise(resolve => {
            for (let k in files) {
                if (/\.(jpg|gif|png|bmg|jpeg)/.test(files[k])) {
                    //图片的预加载
                    arr.push(new Promise(resolve => {
                        let image = wx.createImage();
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
                            let audio = wx.createInnerAudioContext();
                            audio.src = files[k];
                            audio.onCanplay(() => {
                                console.log(2222)
                                this.caches[files[k]] = audio;
                                resolve();
                            })
                        })
                        )
                    }
            }
            return Promise.all(arr).catch(() => {
                console.log('加载资源出错.')
            }).then(() => {
                console.log('加载资源完成.')
                resolve();
            })
        })
    },
    play(url) {
        //播放声音
        this.caches[url].stop();
        this.caches[url].play();
    }
}