import {CanvasRecorder} from './recorder.js';
import {surface} from './surfaces.js';
import {fit} from './settings.js';
/** Separate 1080p-class recording surface, independent of PNG resolution. */
export class Movie{
 start(source){const size=fit(source.width,source.height,Math.min(1920,Math.max(source.width,source.height)));this.canvas=surface(size.width,size.height);this.ctx=this.canvas.getContext('2d');this.source=source;this.recorder=new CanvasRecorder();this.update();this.recorder.start(this.canvas);this.timer=setInterval(()=>this.update(),100);}
 update(){if(this.ctx)this.ctx.drawImage(this.source,0,0,this.canvas.width,this.canvas.height);}
 async stop(){clearInterval(this.timer);this.update();if(this.recorder?.recorder)return this.recorder.stop();return null;}
}
