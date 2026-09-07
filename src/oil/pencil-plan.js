import {scalePass} from './detail.js';
import {planPass} from './planner.js';
export function planPencil(ref,index,seed,scale=1){
 const pass={size:[15,11,7,4][index],spacing:[6,4,3,2.5][index],opacity:1};
 const dabs=planPass(ref,scalePass(pass,scale),seed).filter(d=>{const darkness=1-(.2126*d.color[0]+.7152*d.color[1]+.0722*d.color[2])/255;d.opacity=Math.min(.65,.08+darkness*.5);d.angle=index%2?-.8:.55;return darkness>[.08,.25,.45,.65][index]&&d.seed%100<darkness*100;});
 return {name:['薄い鉛筆の当たり','ハッチングで陰影','交差する線を重ねる','濃い芯で締める'][index],dabs};
}
