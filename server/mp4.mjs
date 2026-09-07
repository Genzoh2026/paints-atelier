import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {access,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const run=promisify(execFile);
/** Local executable only. FFmpeg is not bundled or downloaded. */
export function converter(storage,executable=process.env.FFMPEG_PATH||'ffmpeg'){
 let pending=null;
 return async id=>{
  const source=storage.locate(id,'process.webm'),target=storage.locate(id,'process.mp4');
  await access(source);try{await access(target);return;}catch{/* Not converted yet. */}
  if(pending){if(pending.id===id)return pending.promise;throw Error('別のMP4を変換中です。完了後に再試行してください。');}
  const temporary=target.replace('process.mp4',`.export-${randomUUID()}.mp4`);
  const promise=(async()=>{try{
   await run(executable,['-nostdin','-v','error','-i',source,'-map','0:v:0','-an','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',temporary],{windowsHide:true,timeout:600000,maxBuffer:1024*1024});
   await rename(temporary,target);
  }catch(error){throw Error(error.code==='ENOENT'?'MP4保存にはFFmpegが必要です。READMEの設定手順を確認してください。':'MP4変換に失敗しました。FFmpegと動画を確認して再試行してください。');}
  finally{await unlink(temporary).catch(()=>{});pending=null;}})();
  pending={id,promise};return promise;
 };
}
