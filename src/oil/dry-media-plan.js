import {scalePass} from './detail.js';
import {planPass} from './planner.js';

export function planCharcoal(ref,index,seed,scale=1){
 const pass={size:[28,19,11,6][index],spacing:[11,8,5,3][index],opacity:.7};
 const dabs=planPass(ref,scalePass(pass,scale),seed).filter(d=>{
  const darkness=1-(.2126*d.color[0]+.7152*d.color[1]+.0722*d.color[2])/255;
  d.color=[38,36,35];d.opacity=Math.min(.85,darkness*.85);return darkness>[.06,.18,.36,.58][index];
 });
 return {name:['木炭を寝かせて陰影','炭粉を擦り込む','暗部を重ねる','黒い筆跡で締める'][index],dabs};
}

export function planPastel(ref,index,seed,scale=1){
 const pass={size:[29,20,12,7][index],spacing:[11,8,5,3.5][index],opacity:[.4,.5,.6,.65][index]};
 const dabs=planPass(ref,scalePass(pass,scale),seed);
 for(const d of dabs)d.color=d.color.map(c=>Math.round(c*.92+255*.08));
 return {name:['パステルで色面','柔らかい色を重ねる','粉の粒で描き込む','明るい色で仕上げる'][index],dabs};
}
