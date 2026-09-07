/** Irregular translucent washes with a broken pigment edge, not circular stamps. */
export function watercolorMark(ctx,d){
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);const r=d.size*.7;
 const color=a=>`rgba(${d.color.join(',')},${a})`;
 const points=Array.from({length:12},(_,j)=>{const a=j/12*Math.PI*2,rad=r*(.65+((d.seed+j*29)%41)/100);return [Math.cos(a)*rad*1.35,Math.sin(a)*rad*.7];});
 ctx.beginPath();ctx.moveTo(...points[0]);for(let j=1;j<points.length;j++)ctx.lineTo(...points[j]);ctx.closePath();ctx.fillStyle=color(d.opacity*.72);ctx.fill();
 // Pigment collects along only a small, irregular section of the wash.
 ctx.beginPath();ctx.moveTo(...points[2]);ctx.lineTo(...points[3]);ctx.lineTo(...points[4]);ctx.strokeStyle=color(d.opacity*.2);ctx.lineWidth=.22;ctx.stroke();
 ctx.save();ctx.clip();for(let j=0;j<14;j++){const x=(((d.seed+j*37)%101)/101-.5)*r*2,y=(((d.seed+j*53)%97)/97-.5)*r;ctx.fillStyle=color(d.opacity*.12);ctx.fillRect(x,y,.3,.3);}ctx.restore();ctx.restore();
}
