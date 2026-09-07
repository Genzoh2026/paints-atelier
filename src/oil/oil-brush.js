/** An individual opaque oil daub, including irregular edges, bristle grooves and impasto light. */
export function oilDab(ctx,d){
 const relief=d.impasto||0;
 const r=d.size/2,w=r*(.71+(d.seed%19)/70),h=r*(1.05+(d.seed%13)/50)*(1+relief*.22);const rgb=(delta,alpha=1)=>`rgba(${d.color.map(v=>Math.max(0,Math.min(255,Math.round(v+delta)))).join(',')},${alpha})`;
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);ctx.globalAlpha=d.opacity;
 const shape=()=>{ctx.beginPath();ctx.moveTo(-h,-w*.5);ctx.bezierCurveTo(-h*.72,-w*1.05,-h*.2,-w*.82,h*.55,-w*.83);ctx.bezierCurveTo(h*1.13,-w*.6,h*1.1,-w*.1,h,.25*w);ctx.bezierCurveTo(h*.82,w*.86,h*.03,w*.9,-h*.75,w*.72);ctx.bezierCurveTo(-h*.94,w*.44,-h*1.13,-w*.1,-h,-w*.5);ctx.closePath();};
 // Paint surface covers the underpainting; the source bitmap is never copied here.
 shape();ctx.fillStyle=rgb(-1.5);ctx.fill();ctx.save();ctx.clip();
 ctx.lineCap='round';
 const bristles=relief?7:4;
 for(let j=0;j<bristles;j++){const yy=(-.65+j*(1.2/(bristles-1)))*w;ctx.beginPath();ctx.moveTo(-h*.78,yy);ctx.quadraticCurveTo(-h*.05,yy-w*.09,h*.85,yy+w*.10);ctx.strokeStyle=rgb(j%2?19+relief*15:-24-relief*11,j%2?.32+relief*.12:.23+relief*.10);ctx.lineWidth=Math.max(.065,w*.08);ctx.stroke();}
 ctx.restore();
 ctx.beginPath();ctx.moveTo(-h*.7,-w*.57);ctx.quadraticCurveTo(0,-w*.83,h*.55,-w*.61);ctx.strokeStyle=rgb(25+relief*20,.27+relief*.16);ctx.lineWidth=Math.max(.065,w*.10);ctx.stroke();
 ctx.beginPath();ctx.moveTo(-h*.5,w*.6);ctx.quadraticCurveTo(0,w*.83,h*.63,w*.5);ctx.strokeStyle=rgb(-33-relief*8,.22+relief*.14);ctx.lineWidth=Math.max(.065,w*.12);ctx.stroke();
 if(relief){ctx.save();shape();ctx.clip();for(let j=0;j<5;j++){const t=((d.seed*(j+3))%97)/97;ctx.beginPath();ctx.moveTo(-h*.8+t*h*.9,(-.6+j*.27)*w);ctx.lineTo(h*(.35+t*.45),(-.63+j*.27)*w);ctx.lineWidth=Math.max(.09,w*.055);ctx.strokeStyle=rgb(j%2?42:-35,.16+relief*.12);ctx.stroke();}ctx.restore();}
 ctx.restore();
}
