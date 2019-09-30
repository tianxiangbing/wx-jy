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
    caches:{},
    loadImages(files) {
        // let cache = {};
        let arr = []; 
        return new Promise(resolve => {
            for (let k in files) {
                arr.push(new Promise(resolve => {
                    let image = wx.createImage();
                    image.onload = () => {
                        this.caches[ files[k]] = image;
                        resolve();
                    }
                    image.src = files[k];
                })
                )
            }
            return Promise.all(arr).catch(() => {
                console.log('加载资源出错.')
            }).then(() => {
                console.log('加载资源完成.')
                resolve();
            })
        })
    }
}