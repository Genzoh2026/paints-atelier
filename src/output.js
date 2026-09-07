export async function request(url,body){const response=await fetch(url,{method:'POST',body});if(!response.ok)throw Error(await response.text()||'保存に失敗しました。');return response.json();}
export async function saveOutputs(result){
 const job=await request('/api/jobs');
 for(const [name,blob] of [['painting.png',result.painting],['sketch.png',result.line],['process.webm',result.video]]){
  if(blob)await request(`/api/jobs/${job.id}/${name}`,blob);
 }
 return job;
}
export const saveMp4=job=>request(`/api/jobs/${job.id}/mp4`);
