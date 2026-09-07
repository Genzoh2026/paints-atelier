import {oilDab} from './oil-brush.js';
import {pencilMark} from './pencil-brush.js';
import {watercolorMark} from './watercolor-brush.js';
import {crayonMark} from './crayon-brush.js';
import {charcoalMark,pastelMark} from './dry-media-brush.js';
import {markerMark} from './marker-brush.js';
export function brushFor(style){return {pencil:pencilMark,watercolor:watercolorMark,crayon:crayonMark,charcoal:charcoalMark,pastel:pastelMark,marker:markerMark}[style]||oilDab;}
