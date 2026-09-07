import {analyzePixels,linePixels} from './analysis.js';
import {planPass,PASSES} from './planner.js';
import {painterlyPass} from './painterly.js';
import {mediaPlans} from './media-plan.js';
let reference;
self.onmessage=({data})=>{try{
 if(data.type==='analyze'){reference=analyzePixels(data.pixels,data.width,data.height);const lines=linePixels(reference);postMessage({lines},[lines.buffer]);}
 else if(data.type==='pass'){if(!reference)throw Error('参照画像がありません。');if(Object.hasOwn(mediaPlans,data.style)){postMessage(mediaPlans[data.style](reference,data.index,7331+data.index*191,data.brushScale));return;}if(data.style==='painterly'){postMessage(painterlyPass(reference,data.index,7331+data.index*191,data.brushScale));return;}const preset=PASSES[data.index];const pass={...preset,size:preset.size*data.brushScale,spacing:preset.spacing*data.brushScale};postMessage({name:pass.name,dabs:planPass(reference,pass,7331+data.index*191)});}
 else throw Error('不明な解析要求です。');
 }catch(error){postMessage({error:error.message});}};
