/** Shared brush-size and placement-density policy for every medium. */
export const DETAIL_SCALES={coarse:1.7,medium:1,fine:.55};
export function detailScale(detail){if(!Object.hasOwn(DETAIL_SCALES,detail))throw Error('描画の細かさが不正です。');return DETAIL_SCALES[detail];}
export function scalePass(pass,scale=1){return {...pass,size:pass.size*scale,spacing:pass.spacing*scale};}
