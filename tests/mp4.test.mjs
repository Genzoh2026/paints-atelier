import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,readdir,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Storage} from '../server/storage.mjs';
import {converter} from '../server/mp4.mjs';
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';let available=true;try{execFileSync(ffmpeg,['-version'],{stdio:'pipe',windowsHide:true});}catch{available=false;}
test('real H.264 export preserves source, pads odd sizes and reuses result',{skip:!available},async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'paints-video-')),storage=new Storage(root);
 try{
  const {id}=await storage.create(),source=storage.locate(id,'process.webm');
  execFileSync(ffmpeg,['-v','error','-f','lavfi','-i','testsrc=size=161x121:rate=10','-t','0.5','-c:v','libvpx-vp9',source],{stdio:'pipe',windowsHide:true});
  const original=await readFile(source),convert=converter(storage,ffmpeg);await convert(id);
  const target=storage.locate(id,'process.mp4');assert.equal((await readFile(target)).subarray(4,8).toString(),'ftyp');assert.deepEqual(await readFile(source),original);
  const stamp=(await stat(target)).mtimeMs;await convert(id);assert.equal((await stat(target)).mtimeMs,stamp);
  execFileSync(ffmpeg,['-v','error','-i',target,'-f','null','-'],{stdio:'pipe',windowsHide:true});
  const broken=await storage.create();await writeFile(storage.locate(broken.id,'process.webm'),'invalid');await assert.rejects(convert(broken.id));assert.deepEqual(await readdir(path.join(root,broken.id)),['process.webm']);
 }finally{await rm(root,{recursive:true,force:true});}
});
