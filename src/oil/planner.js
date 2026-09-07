import {sample} from './analysis.js';
export const PASSES=[{name:'暗色の下塗り・大きな色面',size:18,spacing:9,opacity:.98},{name:'中筆で立体を作る',size:8,spacing:4,opacity:.97},{name:'顔・髪・衣服を細筆で描く',size:3.7,spacing:2,opacity:.97},{name:'絵具の粒と毛筋で仕上げる',size:1.9,spacing:1.15,opacity:.95}];
export function planPass(ref,pass,seed){let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)|0;return(state>>>0)/4294967296;};const result=[];
 for(let y=pass.spacing*.3;y<ref.height;y+=pass.spacing)for(let x=pass.spacing*.3;x<ref.width;x+=pass.spacing){const xx=Math.min(ref.width-1,Math.max(0,x+(random()-.5)*pass.spacing*.7)),yy=Math.min(ref.height-1,Math.max(0,y+(random()-.5)*pass.spacing*.7)),i=Math.round(yy)*ref.width+Math.round(xx);const detail=ref.edge[i];const angle=detail>2?Math.atan2(ref.gy[i],ref.gx[i])+Math.PI/2: -.8+(random()-.5)*.7;const radius=pass.size*(detail>17?.72:1)*(.88+random()*.24);result.push({x:xx,y:yy,size:radius,angle:angle+(random()-.5)*.35,color:sample(ref,xx,yy),opacity:pass.opacity,seed:Math.floor(random()*1000000)});}
 // A seeded shuffle avoids a printer-like row scan. Coarse paint begins in the darks.
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(pass.size>10)result.sort((a,b)=>a.color[0]+a.color[1]+a.color[2]-b.color[0]-b.color[1]-b.color[2]);
 return result;
}
