import {scalePass} from './detail.js';
import {planPass} from './planner.js';
export function planMarker(ref,index,seed,scale=1){
 const pass={size:[26,18,11,6][index],spacing:[13,9,5.5,3.5][index],opacity:[.22,.28,.34,.4][index]};
 const dabs=planPass(ref,scalePass(pass,scale),seed);
 for(const d of dabs)d.angle=index%2?-.55:.55;
 return {name:['マーカーで広い色面','帯状の色を重ねる','ペン先で形を描く','輪郭を引き締める'][index],dabs};
}
