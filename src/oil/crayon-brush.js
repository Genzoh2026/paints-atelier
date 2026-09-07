export function crayonMark(ctx,d){
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);ctx.fillStyle=`rgb(${d.color.join(',')})`;ctx.strokeStyle=ctx.fillStyle;ctx.lineCap='round';
 ctx.globalAlpha=d.opacity*.25;ctx.lineWidth=d.size*.65;ctx.beginPath();ctx.moveTo(-d.size*.55,0);ctx.lineTo(d.size*.55,0);ctx.stroke();
 let state=d.seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)|0;return(state>>>0)/4294967296;};
 for(let j=0;j<45;j++){const x=(random()-.5)*d.size*1.6,y=(random()-.5)*d.size*.8;ctx.globalAlpha=d.opacity*(.25+random()*.65);const size=.18+random()*.65;ctx.fillRect(x,y,size*(1+random()*2),size);}ctx.restore();
}
