import {readReference} from './oil/image-input.js';
import {bindImageDrop} from './oil/drop-input.js';
import {settings} from './oil/settings.js';
import {MEDIA} from './oil/mixed-media.js';
import {runPainting} from './oil/runner.js';
import {viewport} from './viewport.js';
import {demoFile} from './demo.js';
import {saveOutputs,saveMp4} from './output.js';
const $=id=>document.getElementById(id);
let reference=null,result=null,job=null,busy=false,saving=false,paused=false,controller=null,urls=[];
const view=viewport($('stage'),$('art'),$('zoom-label'));
const status=text=>{$('status').textContent=text;};
for(const [value,text] of MEDIA)$('style').add(new Option(text,value));
function secondary(){const selected=$('secondary').value;$('secondary').replaceChildren(new Option('なし','none'));for(const [value,text] of MEDIA)if(value!==$('style').value)$('secondary').add(new Option(text,value));$('secondary').value=[...$('secondary').options].some(o=>o.value===selected)?selected:'none';$('mix').hidden=$('secondary').value==='none';}
secondary();
function lock(value){busy=value;for(const id of ['file','sample','size','style','secondary','mix-mode','strength','detail','record'])$(id).disabled=value||saving;$('start').disabled=value||saving||!reference;$('pause').disabled=$('cancel').disabled=!controller;$('compare').disabled=value||!result;$('save').disabled=value||saving;$('mp4').disabled=value||saving;}
const config=()=>settings(reference.width,reference.height,Number($('size').value),$('style').value,document.querySelector('input[name=detail]:checked').value,$('secondary').value,Number($('strength').value),$('mix-mode').value);
function describe(){if(reference){const c=config();$('dimensions').textContent=`${reference.name} · ${reference.width} × ${reference.height} → ${c.output.width} × ${c.output.height} px`;}}
function clearResult(){for(const url of urls)URL.revokeObjectURL(url);urls=[];result=job=null;$('results').hidden=true;$('downloads').replaceChildren();$('video').pause();$('video').removeAttribute('src');$('video').load();$('video').hidden=true;$('save-status').textContent='';$('path').textContent='outputs/';$('progress').value=0;}
async function load(file){if(busy||saving)return;lock(true);try{const next=await readReference(file);clearResult();if(reference)URL.revokeObjectURL(reference.url);reference=next;$('reference').src=$('original').src=next.url;$('reference').hidden=$('original').hidden=false;$('painting').hidden=true;$('compare').textContent='参照画像と比較';describe();view.fit();status('準備完了。制作を開始できます。');}catch(error){status(error.message);}finally{lock(false);}}
$('file').onchange=()=>{if($('file').files[0])load($('file').files[0]);};
$('sample').onclick=async()=>load(await demoFile());
bindImageDrop($('drop-zone'),{isBusy:()=>busy||saving,onFile:load,onError:status});
$('style').onchange=()=>{secondary();describe();};$('secondary').onchange=secondary;$('size').onchange=describe;
$('strength').oninput=()=>{$('strength-value').textContent=$('strength').value+'%';};
$('fit').onclick=view.fit;$('zoom-in').onclick=()=>view.zoom(1.2);$('zoom-out').onclick=()=>view.zoom(1/1.2);
$('compare').onclick=()=>{$('original').hidden=!$('original').hidden;$('painting').hidden=!$('original').hidden;$('compare').textContent=$('painting').hidden?'作品を表示':'参照画像と比較';};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'再開':'一時停止';};$('cancel').onclick=()=>controller?.abort();
function downloads(){for(const [name,blob,label] of [['painting.png',result.painting,'完成PNG'],['sketch.png',result.line,'線画PNG'],['process.webm',result.video,'工程WebM']]){if(!blob)continue;const url=URL.createObjectURL(blob);urls.push(url);const a=document.createElement('a');a.href=url;a.download=name;a.textContent=label;$('downloads').append(a);if(name==='process.webm'){$('video').src=url;$('video').hidden=false;}}$('results').hidden=false;$('mp4').hidden=!result.video;}
async function persist(mp4=false){if(!result||busy||saving)return;saving=true;lock(false);$('save-status').textContent='端末に保存しています…';try{if(!job)job=await saveOutputs(result);$('path').textContent=job.path;if(mp4){$('save-status').textContent='MP4に圧縮しています…';await saveMp4(job);let a=$('mp4-link');if(!a){a=document.createElement('a');a.id='mp4-link';a.textContent='工程MP4';a.download='process.mp4';$('downloads').append(a);}a.href=`/outputs/${job.id}/process.mp4`;}$('save-status').textContent=mp4?'MP4を保存しました。':'作品を保存しました。';}catch(error){$('save-status').textContent=error.message+' PNG・WebMは上のリンクから保存できます。';}finally{saving=false;lock(false);}}
$('save').onclick=()=>persist();$('mp4').onclick=()=>persist(true);
$('start').onclick=async()=>{if(busy||saving||!reference)return;clearResult();controller=new AbortController();paused=false;$('pause').textContent='一時停止';$('original').hidden=true;$('painting').hidden=false;lock(true);try{result=await runPainting({canvas:$('painting'),reference,config:config(),record:$('record').checked,signal:controller.signal,paused:()=>paused,progress:(text,value)=>{status(text);$('progress').value=value;}});downloads();$('progress').value=1;status(`完成 · ${result.count.toLocaleString()} 筆。${result.warning||''}`);}catch(error){status(error.name==='AbortError'?'制作を中止しました。':error.message);}finally{controller=null;lock(false);}if(result)await persist(Boolean(result.video));};
window.addEventListener('beforeunload',event=>{if(busy||saving){event.preventDefault();event.returnValue='';}});
