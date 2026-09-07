import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {Storage,ARTIFACTS} from './storage.mjs';
import {converter} from './mp4.mjs';
export function createServer(root,{outputRoot=path.join(root,'outputs'),ffmpeg}={}){
 const storage=new Storage(outputRoot),convert=converter(storage,ffmpeg);
 const server=http.createServer(async(req,res)=>{
  const host=`127.0.0.1:${server.address().port}`,origin=`http://${host}`;
  const send=(status,data,type='application/json; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type});res.end(typeof data==='object'&&!Buffer.isBuffer(data)?JSON.stringify(data):data);};
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
  try{
   if(req.headers.host!==host){send(403,'Local access only');return;}
   const url=new URL(req.url,origin),parts=url.pathname.split('/');
   if(req.method==='POST'){
    if(req.headers.origin!==origin){send(403,'Local UI only');return;}
    if(url.pathname==='/api/jobs'){send(201,await storage.create());return;}
    if(parts.length===5&&parts[1]==='api'&&parts[2]==='jobs'){
     const [, , ,id,name]=parts;
     if(name==='mp4'){await convert(id);send(200,{name:'process.mp4'});return;}
     storage.locate(id,name);if(name==='process.mp4'){send(400,'MP4 upload is not accepted');return;}
     let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>350000000){send(413,'File too large');return;}chunks.push(chunk);}
     await storage.save(id,name,Buffer.concat(chunks));send(201,{saved:true});return;
    }
    send(404,'Not found');return;
   }
   if(req.method!=='GET'&&req.method!=='HEAD'){send(405,'Method not allowed');return;}
   if(parts.length===4&&parts[1]==='outputs'){
    const data=await storage.read(parts[2],parts[3]);res.setHeader('Content-Length',data.length);send(200,req.method==='HEAD'?'':data,ARTIFACTS[parts[3]]);return;
   }
   const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
   if(!/^(index\.html|style\.css|src\/[a-z-]+\.js|src\/oil\/[a-z-]+\.js)$/.test(file)){send(404,'Not found');return;}
   const data=await readFile(path.join(root,file));const type=file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8';send(200,req.method==='HEAD'?'':data,type);
  }catch(error){send(error.code==='ENOENT'?404:400,error.code==='ENOENT'?'File not found':error.message);}
 });
 return server;
}
