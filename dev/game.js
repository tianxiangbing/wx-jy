!function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=2)}([function(t,e,i){"use strict";var s=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{a(s.next(t))}catch(t){o(t)}}function h(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,h)}a((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.default={waitMoment(t){return s(this,void 0,void 0,(function*(){return new Promise(e=>{let i=setTimeout(()=>{clearTimeout(i),e()},t)})}))},write(t,e,i,s,n="14px Arial",o="#000000"){let r=t.context;r.font=n,r.fillStyle=o,null==i&&(i=(t.width-14*e.length)/2),null==s&&(s=t.height/2-15),r.fillText(e,i,s)},draw(t,e,i,s,n,o,r,h,a,l){let c=t.context,u=this.caches[e],d=Array.prototype.slice.call(arguments,2);d.unshift(u),console.log("draw",e),c.drawImage.call(c,...d)},random:(t,e)=>Math.floor(Math.random()*(e-t)+t),caches:{},loadResources(t){let e=[];return new Promise(i=>{for(let i in t)/\.(jpg|gif|png|bmg|jpeg)/.test(t[i])?e.push(new Promise(e=>{let s=wx.createImage();s.onload=()=>{this.caches[t[i]]=s,e()},s.src=t[i]})):/\.(mp3|wav|avi|m4a|aac)/.test(t[i])&&e.push(new Promise(e=>{let s=wx.createInnerAudioContext();s.src=t[i],s.onCanplay(()=>{console.log(2222),this.caches[t[i]]=s,e()})}));return Promise.all(e).catch(()=>{console.log("加载资源出错.")}).then(()=>{console.log("加载资源完成."),i()})})},play(t){this.caches[t].stop(),this.caches[t].play()}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=i(0);var n;!function(t){t[t.rect=0]="rect",t[t.circle=1]="circle"}(n=e.SHAPE||(e.SHAPE={}));e.default=class{constructor(t,e="",i=0,s=0,o=0,r=0){this.stage=t,this.imgSrc=e,this.type=n.rect,this.r=0,this.width=i,this.height=s,this.x=o,this.y=r,this.visible=!0}draw(){this.visible&&s.default.draw(this.stage,this.imgSrc,this.x,this.y,this.width,this.height)}hits(t){let e=t.x+t.width/2,i=t.y+t.height/2;return!(!this.visible||!t.visible)&&!!(e>=this.x&&e<=this.x+this.width&&i>=this.y&&i<=this.y+this.height)}touchHits(t,e){let i=t.touches[0];this.hits({x:i.clientX,y:i.clientY,width:0,height:0,visible:!0})&&e&&e.call(this)}getCenter(){return[this.x+this.r,this.y+this.r]}}},function(t,e,i){"use strict";var s=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{a(s.next(t))}catch(t){o(t)}}function h(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,h)}a((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const n=i(3);wx.showShareMenu({withShareTicket:!0});const o=wx.createCanvas(),[r,h]=[o.height,o.width];let a=new n.Stage(o,h,r,"#FFFFFF"),l=new n.Title("打气球",a);l.create=t=>{n.lib.write(a,"一起来打气球"),t()};let c=new n.Descript(a);c.create=t=>s(void 0,void 0,void 0,(function*(){n.lib.draw(a,"images/descript.jpg",0,0,a.width,a.height);let e=new n.Sprite(a,"images/btn-start.png",100,40,(h-100)/2,r-40-40);e.draw(),wx.onTouchStart(i=>{e.touchHits(i,()=>{wx.offTouchStart(),t()})})}));class u extends n.Sprite{constructor(){super(...arguments),this.speed=1}update(){this.y-=this.speed,this.y+this.height<0&&(this.visible=!1)}}let d=new class extends n.JY{constructor(){super(...arguments),this.frame=0,this.ballList=[],this.score=0,this.life=3}reset(){this.score=0,this.life=3,this.ballList=[]}newGame(){this.stage.style="green",this.setState(n.STATE.running),wx.onTouchStart(t=>{let{clientX:e,clientY:i}=t;console.log(e,i),this.ballList.forEach((e,i)=>{e.touchHits(t,()=>{this.ballList.splice(i,1),this.score++,n.lib.play("audio/boom.mp3")})})})}running(){return s(this,void 0,void 0,(function*(){this.frame++,this.stage.clear(),this.createSprite(),this.ballList.forEach((t,e)=>{t.update(),t.draw(),t.visible||(this.ballList.splice(e,1),this.life--,this.life<=0&&this.setState(n.STATE.gameOver))}),this.showScore()}))}showScore(){n.lib.write(a,"生命值："+this.life,10,20),n.lib.write(a,"得分："+this.score,10,50)}createSprite(){if(Math.floor(800*Math.random())<this.score/5*2+10){let t=n.lib.random(0,a.width-30),e=40,i=340/120*e,s=new u(this.stage,"images/ball.png",e,i,t,this.stage.height);s.speed+=this.score/3,this.ballList.push(s)}}gameOver(){return s(this,void 0,void 0,(function*(){a.clear(),n.lib.write(a,"游戏结束！总得分："+this.score),wx.shareAppMessage({title:"最爱打气球",imageUrl:o.toTempFilePathSync({destWidth:500,destHeight:400})}),yield n.lib.waitMoment(3e3),this.reset(),this.setState(n.STATE.descript)}))}}(a,l,c);d.resources=["images/ball.png","images/btn-start.png","images/descript.jpg","audio/boom.mp3"],d.setup()},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=i(4);e.JY=s.default,e.STATE=s.STATE;const n=i(5);e.Control=n.default;const o=i(6);e.Descript=o.default;const r=i(7);e.GameOver=r.default;const h=i(1);e.Sprite=h.default;const a=i(8);e.Stage=a.default;const l=i(9);e.Title=l.default;const c=i(0);e.lib=c.default},function(t,e,i){"use strict";var s=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{a(s.next(t))}catch(t){o(t)}}function h(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,h)}a((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const n=i(1),o=i(0);var r;!function(t){t[t.loading=0]="loading",t[t.title=1]="title",t[t.descript=2]="descript",t[t.newGame=3]="newGame",t[t.running=4]="running",t[t.gameOver=5]="gameOver"}(r=e.STATE||(e.STATE={}));e.default=class{constructor(t,e,i,s,n){this.stage=t,this.titleStage=e,this.descriptStage=i,this.gameOverStage=s,this.controlStage=n,this.func=new Function,this.ispause=!1,this.interval=10,this.resources=[],this.context=t.context}setup(){this.stage.draw(),this.currentState=r.loading,this.setState(r.loading),this.loop()}loop(){return s(this,void 0,void 0,(function*(){this.ispause||(yield this.func()),this.aniId=requestAnimationFrame(this.loop.bind(this))}))}createControl(){}newGame(){this.setState(r.running)}over(){this.setState(r.gameOver)}pause(){this.ispause=!0,window.cancelAnimationFrame(this.aniId)}play(){this.ispause=!1,this.loop()}gameOver(){console.log("gameOver"),this.stage.clear(),this.showGameOver()}showGameOver(){return s(this,void 0,void 0,(function*(){console.log("game  over..."),yield o.default.waitMoment(3e3)}))}running(){console.log("running...")}loading(){return s(this,void 0,void 0,(function*(){console.log("loading...."),yield this.showLoading(),console.log("loading end..."),this.setState(r.title)}))}showLoading(){return o.default.write(this.stage,"正在加载中"),o.default.loadResources(this.resources)}title(){return s(this,void 0,void 0,(function*(){console.log("title...."),yield this.showTitle(),this.setState(r.descript)}))}showTitle(){return new Promise(t=>{this.titleStage.create(t)})}descript(){return s(this,void 0,void 0,(function*(){console.log("descript..."),yield this.showDescript(),this.setState(r.newGame)}))}showDescript(){return new Promise(t=>{this.descriptStage.create(t)})}proxy(t){return this.stage.clear(),t.bind(this)}checkState(){switch(this.currentState){case r.loading:this.func=this.proxy(this.loading);break;case r.title:this.func=this.proxy(this.title);break;case r.descript:this.func=this.proxy(this.descript);break;case r.newGame:this.func=this.proxy(this.newGame);break;case r.running:this.func=this.proxy(this.running);break;case r.gameOver:this.func=this.proxy(this.gameOver)}}setState(t){this.currentState=t,this.checkState()}hits(t,e){var i=!1,s=!1;if(t.type==n.SHAPE.rect){var o=e.width,r=t.width,h=e.height,a=t.height;return i=t.x>e.x?t.x-e.x<o:!(t.x<e.x)||e.x-t.x<r,s=t.y>e.y?t.y-e.y<h:!(t.y<e.y)||e.y-t.y<a,i&&s}if(t.type==n.SHAPE.circle){var l=t.r+e.r;let n=t.getCenter(),o=e.getCenter();return i=Math.abs(n[0]-o[0])<l,s=Math.abs(n[1]-o[1])<l,i&&s}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=class{constructor(){this.rect=[160,160],this.moveRect=[50,50],this.elemPosition=[10,10],this.angle=0}create(){return this.elem=document.createElement("div"),this.elem.className="control",this.elem.style.position="absolute",this.elem.style.width=this.rect[0]+"px",this.elem.style.height=this.rect[1]+"px",this.elem.style.left=this.elemPosition[0]+"%",this.elem.style.bottom=this.elemPosition[1]+"%",this.moveElem=document.createElement("div"),this.moveElem.className="move",this.moveElem.style.position="absolute",this.moveElem.style.width=this.moveRect[0]+"px",this.moveElem.style.height=this.moveRect[1]+"px",this.elem.appendChild(this.moveElem),this.moveCenter=this.moveRect.map((function(t){return t/2})),this.elemCenter=this.rect.map((function(t){return t/2})),this.resetPos(),this.bindEvent(),this.elem}resetPos(){this.toPosition=[0,0],this.transPosition()}transPosition(){let t=this.elemCenter[0]-this.moveCenter[0]+this.toPosition[0],e=this.elemCenter[1]-this.moveCenter[1]-this.toPosition[1];this.moveElem.style.left=t+"px",this.moveElem.style.top=e+"px"}bindEvent(){this.elem.addEventListener("touchstart",function(t){let e=t.touches[0]||t;this.setPosition(e)}.bind(this),!1),this.elem.addEventListener("touchmove",function(t){let e=t.touches[0]||t;this.setPosition(e)}.bind(this),!1),this.elem.addEventListener("touchend",function(t){this.resetPos()}.bind(this),!1)}setPosition(t){this.position=[this.elem.offsetLeft,this.elem.offsetTop];let e=t.pageX-this.position[0],i=t.pageY-this.position[1],s=e-this.elemCenter[0],n=-(i-this.elemCenter[1]);console.log(s,n);let o=Math.atan2(n,s),r=Math.sqrt(s*s+n*n),h=this.elemCenter[0]-this.moveCenter[0];if(r>h){s=Math.cos(o)*h,n=Math.sin(o)*h}this.toPosition=[s,n],this.transPosition()}getAngle(){return this.angle=Math.atan2(this.toPosition[1],this.toPosition[0]),this.angle}remove(){this.elem.parentNode.removeChild(this.elem)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=class{constructor(t){this.stage=t,console.log(arguments)}create(t){wx.onTouchStart(()=>{console.log("touch..."),wx.offTouchStart(),t()})}remove(){this.stage.clear()}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=class{constructor(t){this.btntitle=t}create(t,e=""){this.elem=document.createElement("div"),this.elem.className="gameOver",this.textElem=document.createElement("div"),this.textElem.className="text",this.textElem.innerHTML=e,this.elem.appendChild(this.textElem);let i=document.createElement("button");return i.className="button",i.innerText=this.btntitle,i.addEventListener("touchstart",function(e){t.call(this)}.bind(this),!1),this.elem.appendChild(i),this.elem}setText(t=""){this.textElem.innerHTML=t}remove(){this.elem.parentNode.removeChild(this.elem)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=class{constructor(t,e,i,s){this.canvas=t,this.width=e,this.height=i,this.style=s,this.context=t.getContext("2d")}draw(t){this.context.fillStyle=this.style,this.context.fillRect(0,0,this.width,this.height)}clear(){this.context.clearRect(0,0,this.width,this.height),this.draw()}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=i(0);e.default=class{constructor(t,e){this.title=t,this.stage=e}create(t){s.default.write(this.stage,this.title),s.default.waitMoment(3e3),t()}remove(){this.stage.clear()}}}]);