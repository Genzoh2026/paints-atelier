/** An original procedural still life; no bundled personal or third-party images. */
export async function demoFile(){
 const c=document.createElement('canvas');c.width=640;c.height=480;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,640,480);g.addColorStop(0,'#263d43');g.addColorStop(1,'#879782');x.fillStyle=g;x.fillRect(0,0,640,480);
 x.fillStyle='#ad8561';x.fillRect(0,340,640,140);x.fillStyle='#483f37';x.beginPath();x.ellipse(330,380,170,28,0,0,Math.PI*2);x.fill();
 const vase=x.createLinearGradient(230,0,400,0);vase.addColorStop(0,'#613c42');vase.addColorStop(.5,'#c17465');vase.addColorStop(1,'#754044');x.fillStyle=vase;x.beginPath();x.moveTo(265,245);x.bezierCurveTo(200,430,435,430,370,245);x.closePath();x.fill();
 for(let i=0;i<7;i++){const px=210+i*35,py=110+(i%3)*33;x.strokeStyle='#384a33';x.lineWidth=7;x.beginPath();x.moveTo(320,260);x.quadraticCurveTo(px,230,px,py);x.stroke();for(let j=0;j<7;j++){const a=j*Math.PI*2/7;x.fillStyle=i%2?'#ebc780':'#d8a5a0';x.beginPath();x.ellipse(px+Math.cos(a)*17,py+Math.sin(a)*17,17,10,a,0,Math.PI*2);x.fill();}x.fillStyle='#967341';x.beginPath();x.arc(px,py,10,0,Math.PI*2);x.fill();}
 return new File([await new Promise(resolve=>c.toBlob(resolve,'image/png'))],'atelier-demo.png',{type:'image/png'});
}
