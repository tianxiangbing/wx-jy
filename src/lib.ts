export default {
    /*
    * 暂停一段时间
    */
   //暂停一段时间
    async waitMoment(second:number){
        let t = +new Date();
        return new Promise(resolve=>{
            let n = +new Date();
            if(n - t >= second){
                resolve();
            }
        })
    }
}