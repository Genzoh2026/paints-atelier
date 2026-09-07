/** Oil-stage compositing: reference pixels never enter the paint surface. */
export function surface(width,height){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
export function png(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNGの書き出しに失敗しました。')),'image/png'));}
export class Surfaces{
 constructor(canvas,width,height,analysis){this.canvas=canvas;canvas.width=width;canvas.height=height;this.base=surface(width,height);this.layer=surface(width,height);this.analysis=analysis;this.ctx=canvas.getContext('2d');this.base.getContext('2d').fillStyle='#e9dfcb';this.base.getContext('2d').fillRect(0,0,width,height);this.render();}
 lines(pixels){const small=surface(this.analysis.width,this.analysis.height);small.getContext('2d').putImageData(new ImageData(pixels,small.width,small.height),0,0);this.base.getContext('2d').drawImage(small,0,0,this.canvas.width,this.canvas.height);this.render();}
 beginPass(opacity=1){this.layerOpacity=opacity;const ctx=this.layer.getContext('2d');ctx.resetTransform();ctx.clearRect(0,0,this.layer.width,this.layer.height);ctx.scale(this.canvas.width/this.analysis.width,this.canvas.height/this.analysis.height);return ctx;}
 composite(ctx){ctx.save();ctx.globalAlpha=this.layerOpacity??1;ctx.drawImage(this.layer,0,0);ctx.restore();}
 render(){this.ctx.drawImage(this.base,0,0);this.composite(this.ctx);}
 commit(){this.composite(this.base.getContext('2d'));this.layer.getContext('2d').resetTransform();this.layer.getContext('2d').clearRect(0,0,this.layer.width,this.layer.height);this.render();}
}
