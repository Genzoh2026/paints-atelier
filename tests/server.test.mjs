import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from '../server/http.mjs';
test('local server saves fixed artifacts and excludes private files',async()=>{
 const outputRoot=await mkdtemp(path.join(tmpdir(),'paints-test-'));
 const server=createServer(fileURLToPath(new URL('..',import.meta.url)),{outputRoot});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
 const post=(url,body)=>fetch(origin+url,{method:'POST',headers:{Origin:origin},body});
 try{
  assert.equal((await fetch(origin)).status,200);
  for(const file of ['/server.mjs','/README.md','/.env','/package.json','/outputs/invalid/painting.png'])assert.notEqual((await fetch(origin+file)).status,200);
  assert.equal((await fetch(origin+'/api/jobs',{method:'POST',headers:{Origin:'https://example.com'}})).status,403);
  const job=await (await post('/api/jobs')).json();
  const bytes=Buffer.from('89504e470d0a1a0a0000','hex');
  assert.equal((await post(`/api/jobs/${job.id}/painting.png`,bytes)).status,201);
  assert.deepEqual(Buffer.from(await (await fetch(origin+`/outputs/${job.id}/painting.png`)).arrayBuffer()),bytes);
  assert.equal((await post(`/api/jobs/${job.id}/painting.png`,bytes)).status,400);
  assert.equal((await post(`/api/jobs/${job.id}/sketch.png`,'invalid')).status,400);
  assert.equal((await post(`/api/jobs/${job.id}/mp4`)).status,404);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(outputRoot,{recursive:true,force:true});}
});
