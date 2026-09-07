/** Seeded pigment grains: charcoal uses a rubbed bed, pastel leaves colored powder. */
function powder(ctx,d,charcoal){
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);
 ctx.fillStyle=`rgb(${d.color.join(',')})`;
 ctx.globalAlpha=d.opacity*(charcoal?.2:.28);
 ctx.beginPath();ctx.ellipse(0,0,d.size*.72,d.size*.32,0,0,Math.PI*2);ctx.fill();
 let state=d.seed;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)|0;return(state>>>0)/4294967296;};
 for(let j=0;j<60;j++){
  const x=(random()-.5)*d.size*1.5,y=(random()-.5)*d.size*.75;
  const radius=(.15+random()*.55)*Math.max(1,d.size/14);
  ctx.globalAlpha=d.opacity*(.15+random()*.65);
  ctx.beginPath();ctx.ellipse(x,y,radius*(charcoal?2:1),radius,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}
export const charcoalMark=(ctx,d)=>powder(ctx,d,true);
export const pastelMark=(ctx,d)=>powder(ctx,d,false);
