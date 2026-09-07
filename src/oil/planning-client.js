/** One request at a time; terminate workers on cancellation or completion. */
export class Planner{
 constructor(){this.worker=new Worker(new URL('./planning-worker.js',import.meta.url),{type:'module'});}
 request(data,signal){return new Promise((resolve,reject)=>{
 const cleanup=()=>{signal.removeEventListener('abort',abort);this.worker.onmessage=null;this.worker.onerror=null;};
 const abort=()=>{cleanup();this.close();reject(new DOMException('制作を中止しました。','AbortError'));};
 if(signal.aborted){abort();return;}
 signal.addEventListener('abort',abort,{once:true});
 this.worker.onmessage=({data})=>{cleanup();data.error?reject(Error(data.error)):resolve(data);};
 this.worker.onerror=event=>{cleanup();reject(Error(event.message));};this.worker.postMessage(data);
 });}
 close(){this.worker.terminate();}
}
