import {scalePass} from './detail.js';
import {planPass} from './planner.js';
export function planWatercolor(ref,index,seed,scale=1){
 const pass={size:[38,23,13,7][index],spacing:[16,10,6,4][index],opacity:[.17,.23,.29,.34][index]};
 let dabs=planPass(ref,scalePass(pass,scale),seed);
 dabs=dabs.filter(d=>Math.min(...d.color)<235&&(index<3||ref.edge[Math.round(d.y)*ref.width+Math.round(d.x)]>9));
 return {name:['淡いウォッシュ','透明な色を重ねる','色の溜まりを描く','乾いた筆で輪郭を締める'][index],dabs};
}
