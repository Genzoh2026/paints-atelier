import {scalePass} from './detail.js';
import {planPass} from './planner.js';
export function planCrayon(ref,index,seed,scale=1){
 const pass={size:[24,16,10,6][index],spacing:[10,7,4.5,3][index],opacity:[.55,.65,.7,.72][index]};
 const dabs=planPass(ref,scalePass(pass,scale),seed);for(const d of dabs){d.color=d.color.map(c=>Math.max(0,Math.min(255,Math.round(c/24)*24)));d.angle+=((d.seed%19)-9)*.035;}
 return {name:['クレヨンを寝かせて色面','太い線で塗り重ねる','紙目を残して描き込む','色のアクセント'][index],dabs};
}
