/** Decode a local file; flatten transparency onto the ivory painting ground. */
export async function readReference(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>60000000)throw Error('PNG・JPEG・WebP（60MB以下）を選んでください。');
 const url=URL.createObjectURL(file),image=new Image();
 try{image.src=url;await image.decode();if(image.naturalWidth*image.naturalHeight>64000000||Math.max(image.naturalWidth,image.naturalHeight)>16000)throw Error('画像は6400万画素・各辺16000px以下にしてください。');return {image,url,name:file.name,width:image.naturalWidth,height:image.naturalHeight};}
 catch(error){URL.revokeObjectURL(url);throw Error(error.message||'画像を読み込めませんでした。');}
}
export function referencePixels(image,width,height){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#e9dfcb';ctx.fillRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);return ctx.getImageData(0,0,width,height).data;}
