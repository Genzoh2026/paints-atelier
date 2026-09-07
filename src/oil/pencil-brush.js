export function pencilMark(ctx,d){
 ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle);ctx.strokeStyle='#34312e';ctx.globalAlpha=d.opacity;ctx.lineCap='round';
 for(let j=0;j<3;j++){const y=(j-1)*d.size*.16;ctx.beginPath();ctx.moveTo(-d.size*.6,y);ctx.quadraticCurveTo(0,y+.2,d.size*.6,y+((d.seed+j)%5-2)*.15);ctx.lineWidth=.18+(d.seed%7)*.045;ctx.stroke();}ctx.restore();
}
