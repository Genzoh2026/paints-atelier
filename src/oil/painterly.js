import {scalePass} from './detail.js';
import {sample} from './analysis.js';
import {planPass} from './planner.js';

// Large overlapping marks stay visible through the final pass.
const PASSES = [
 {name:'大きな色面で下塗り',size:32,spacing:14,opacity:.98},
 {name:'平筆で明暗を置く',size:18,spacing:8,opacity:.94},
 {name:'筆の流れで形を描く',size:10,spacing:4.7,opacity:.88},
 {name:'厚塗りのアクセント',size:6.8,spacing:3.2,opacity:.86},
];

/** Average nearby pigments instead of reproducing each source pixel. */
function pigment(reference,dab){
 const radius=dab.size*.22;
 const colors=[[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].map(([x,y])=>sample(reference,dab.x+x,dab.y+y));
 const variation=((dab.seed%17)-8)*.6;
 return [0,1,2].map(channel=>Math.max(0,Math.min(255,Math.round((colors.reduce((sum,c)=>sum+c[channel],0)/5)/12)*12+variation)));
}
export function painterlyPass(reference,index,seed,scale=1){
 const pass=PASSES[index];
 let dabs=planPass(reference,scalePass(pass,scale),seed);
 // Sparse accents preserve the larger underlying strokes in quiet areas.
 if(index===3)dabs=dabs.filter(d=>reference.edge[Math.round(d.y)*reference.width+Math.round(d.x)]>7||d.seed%3===0);
 for(const dab of dabs){dab.color=pigment(reference,dab);dab.impasto=.6+Math.max(...dab.color)/255*.8;dab.angle+=((dab.seed%23)-11)*.014;}
 return {name:pass.name,dabs};
}
