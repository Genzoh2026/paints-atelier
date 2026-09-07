import {detailScale} from './detail.js';
import {MEDIA,validateSecondary} from './mixed-media.js';
/** Resolution and style policy, independent of the UI. */
export function fit(width,height,limit){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||!Number.isFinite(limit)||limit<1)throw Error('画像サイズが不正です。');
 const ratio=limit/Math.max(width,height);return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};
}
export function settings(width,height,longEdge,style,detail='medium',secondaryStyle='none',secondaryStrength=35,secondaryMode='overpaint'){
 if(![1600,2400,3344,4096].includes(longEdge)||!['fine','bold',...MEDIA.map(([value])=>value)].includes(style))throw Error('制作設定が不正です。');
 validateSecondary(style,secondaryStyle,secondaryStrength,secondaryMode);
 return {analysis:fit(width,height,Math.min(1800,Math.max(width,height))),output:fit(width,height,longEdge),style,detail,secondaryStyle,secondaryStrength,secondaryMode,brushScale:detailScale(detail)*(style==='bold'?1.7:1),batch:1600};
}
