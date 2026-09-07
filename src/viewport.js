/** Canvas navigation does not mutate the artwork. */
export function viewport(stage, art, label) {
 let scale=1,x=0,y=0,fitted=true,drag=null;
 const target=()=>[...art.children].find(el=>!el.hidden);
 const render=()=>{art.style.transform=`translate(${x}px,${y}px) scale(${scale})`;label.textContent=Math.round(scale*100)+'%';};
 const fit=()=>{const el=target();if(!el?.offsetWidth||!stage.clientWidth)return;scale=Math.min((stage.clientWidth-32)/el.offsetWidth,(stage.clientHeight-32)/el.offsetHeight);x=y=0;fitted=true;render();};
 const zoom=factor=>{fitted=false;scale=Math.min(20,Math.max(.02,scale*factor));render();};
 stage.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1);},{passive:false});
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;stage.setPointerCapture(e.pointerId);drag={x:e.clientX-x,y:e.clientY-y};fitted=false;});
 stage.addEventListener('pointermove',e=>{if(drag){x=e.clientX-drag.x;y=e.clientY-drag.y;render();}});
 for(const event of ['pointerup','pointercancel'])stage.addEventListener(event,()=>{drag=null;});
 const resize=new ResizeObserver(()=>{if(fitted)fit();});resize.observe(stage);resize.observe(art);
 art.addEventListener('load',()=>{if(fitted)fit();},true);
 new MutationObserver(()=>{if(fitted)fit();}).observe(art,{subtree:true,attributes:true,attributeFilter:['hidden','width','height']});
 fit();return {fit,zoom};
}
