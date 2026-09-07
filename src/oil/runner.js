import {Planner} from './planning-client.js';
import {Surfaces,png} from './surfaces.js';
import {brushFor} from './media-brush.js';
import {referencePixels} from './image-input.js';
import {Movie} from './movie.js';
import {paintingPasses,mediumLabel} from './mixed-media.js';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
/** Owns the lifecycle of one painting; UI and disk storage are injected. */
export async function runPainting({canvas,reference,config,record,signal,paused,progress}){
 const passes=paintingPasses(config);
 const planner=new Planner(),movie=new Movie();let warning='',recording=false;
 const checkpoint=async()=>{if(signal.aborted)throw new DOMException('制作を中止しました。','AbortError');while(paused()){await wait(80);if(signal.aborted)throw new DOMException('制作を中止しました。','AbortError');}};
 try{
 const stages=new Surfaces(canvas,config.output.width,config.output.height,config.analysis);
 if(record){try{movie.start(canvas);recording=true;}catch(error){warning='録画を開始できませんでした: '+error.message;}}
 progress('地塗り',0);await wait(1250);await checkpoint();
 const pixels=referencePixels(reference.image,config.analysis.width,config.analysis.height);
 progress('線画を抽出しています',.01);const {lines}=await planner.request({type:'analyze',pixels,...config.analysis},signal);await checkpoint();stages.lines(lines);progress('下書き',.03);await wait(1200);const line=await png(canvas);
 if(['pencil','watercolor','crayon','charcoal','pastel','marker'].includes(config.style)){const ground=stages.base.getContext('2d');ground.fillStyle='rgba(250,248,242,.92)';ground.fillRect(0,0,canvas.width,canvas.height);stages.render();}
 let count=0;
 for(let step=0;step<passes.length;step++){
  const pass=passes[step],draw=brushFor(pass.style);
  const label=passes.length>4?(pass.secondary?'セカンド画材 · ':'主画材 · ')+mediumLabel(pass.style)+' — ':'';
  await checkpoint();progress(label+'次の筆跡を準備しています',.05+step*(.92/passes.length));
  const {name,dabs}=await planner.request({type:'pass',index:pass.index,style:pass.style,brushScale:config.brushScale},signal);const paint=stages.beginPass(pass.opacity);
  for(let i=0;i<dabs.length;){await checkpoint();const end=Math.min(i+config.batch,dabs.length);for(;i<end;i++){draw(paint,dabs[i]);count++;}stages.render();movie.update();progress(label+name+' · '+count.toLocaleString()+' 筆',.05+(step+i/dabs.length)*(.92/passes.length));await wait(33);}
  stages.commit();await wait(350);
 }
 await checkpoint();progress('仕上げ・書き出し',.98);await wait(1300);const painting=await png(canvas);let video=null;
 if(recording){try{video=await movie.stop();}catch(error){warning='PNGは完成しました。録画の書き出しに失敗しました: '+error.message;}recording=false;}
 await checkpoint();return {painting,line,video,videoSize:video?{width:movie.canvas.width,height:movie.canvas.height}:null,count,warning};
 }finally{planner.close();if(recording)await movie.stop().catch(()=>{});}
}
