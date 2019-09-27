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
        let image = wx.createImage();
        let args = Array.prototype.slice.call(arguments,2);
        args.unshift(image);  
        console.log(args)
        image.onload = ()=>{
            context.drawImage.call(context,...args);
        }
        image.src = img;
    }
}