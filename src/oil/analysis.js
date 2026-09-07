/** Reference analysis only. No painting or display responsibilities. */
export function analyzePixels(data,width,height){
 const gray=new Float32Array(width*height),blur=new Float32Array(width*height),gx=new Float32Array(width*height),gy=new Float32Array(width*height),edge=new Float32Array(width*height);
 for(let i=0;i<gray.length;i++)gray[i]=.2126*data[i*4]+.7152*data[i*4+1]+.0722*data[i*4+2];
 const at=(x,y)=>gray[Math.max(0,Math.min(height-1,y))*width+Math.max(0,Math.min(width-1,x))];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)blur[y*width+x]=(at(x-1,y-1)+2*at(x,y-1)+at(x+1,y-1)+2*at(x-1,y)+4*at(x,y)+2*at(x+1,y)+at(x-1,y+1)+2*at(x,y+1)+at(x+1,y+1))/16;
 const b=(x,y)=>blur[Math.max(0,Math.min(height-1,y))*width+Math.max(0,Math.min(width-1,x))];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*width+x;gx[i]=(b(x+1,y-1)+2*b(x+1,y)+b(x+1,y+1)-b(x-1,y-1)-2*b(x-1,y)-b(x-1,y+1))/4;gy[i]=(b(x-1,y+1)+2*b(x,y+1)+b(x+1,y+1)-b(x-1,y-1)-2*b(x,y-1)-b(x+1,y-1))/4;edge[i]=Math.hypot(gx[i],gy[i]);}
 return{data,width,height,gray,gx,gy,edge};
}
export function sample(reference,x,y){const {data,width,height}=reference;const xx=Math.max(0,Math.min(width-1,x)),yy=Math.max(0,Math.min(height-1,y)),x0=Math.floor(xx),y0=Math.floor(yy),x1=Math.min(width-1,x0+1),y1=Math.min(height-1,y0+1),dx=xx-x0,dy=yy-y0;return[0,1,2].map(c=>Math.round((data[(y0*width+x0)*4+c]*(1-dx)+data[(y0*width+x1)*4+c]*dx)*(1-dy)+(data[(y1*width+x0)*4+c]*(1-dx)+data[(y1*width+x1)*4+c]*dx)*dy));}
export function linePixels(reference){const output=new Uint8ClampedArray(reference.width*reference.height*4);for(let i=0;i<reference.edge.length;i++){output[i*4]=64;output[i*4+1]=53;output[i*4+2]=45;output[i*4+3]=Math.min(175,Math.max(0,(reference.edge[i]-3.3)*10));}return output;}
