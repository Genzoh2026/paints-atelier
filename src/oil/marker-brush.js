export function markerMark(ctx,d){
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);
 ctx.fillStyle=`rgb(${d.color.join(',')})`;ctx.globalAlpha=d.opacity;
 ctx.fillRect(-d.size*.7,-d.size*.25,d.size*1.4,d.size*.5);
 ctx.globalAlpha=d.opacity*.3;
 ctx.fillRect(-d.size*.7,d.size*.19,d.size*1.4,d.size*.06);
 ctx.restore();
}
