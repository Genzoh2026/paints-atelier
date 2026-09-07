/** File-drop interaction only; validation and decoding use the normal upload path. */
export function bindImageDrop(zone,{isBusy,onFile,onError}){
 let depth=0;
 const hasFiles=event=>Array.from(event.dataTransfer?.types||[]).includes('Files');
 const clear=()=>{depth=0;zone.classList.remove('drag-over');};
 window.addEventListener('dragover',event=>{if(hasFiles(event))event.preventDefault();});
 window.addEventListener('drop',event=>{if(hasFiles(event))event.preventDefault();clear();});
 window.addEventListener('dragend',clear);
 zone.addEventListener('dragenter',event=>{if(!hasFiles(event))return;event.preventDefault();if(!isBusy()){depth++;zone.classList.add('drag-over');}});
 zone.addEventListener('dragleave',()=>{depth=Math.max(0,depth-1);if(!depth)clear();});
 zone.addEventListener('dragover',event=>{if(!hasFiles(event))return;event.preventDefault();event.dataTransfer.dropEffect=isBusy()?'none':'copy';});
 zone.addEventListener('drop',event=>{
  if(!hasFiles(event))return;event.preventDefault();clear();if(isBusy())return;
  const files=Array.from(event.dataTransfer.files);
  if(files.length!==1){onError('画像を1枚ずつドロップしてください。');return;}
  onFile(files[0]);
 });
}
