import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export const ARTIFACTS={'painting.png':'image/png','sketch.png':'image/png','process.webm':'video/webm','process.mp4':'video/mp4'};
export class Storage {
 constructor(root){this.root=path.resolve(root);}
 locate(id,name){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)||!Object.hasOwn(ARTIFACTS,name))throw Error('Unknown artifact');return path.join(this.root,id,name);}
 async create(){const id=randomUUID();await mkdir(path.join(this.root,id),{recursive:true});return {id,path:`outputs/${id}/`};}
 async save(id,name,body){const target=this.locate(id,name);if(name==='process.mp4')throw Error('MP4 is produced by the converter');const signature=name.endsWith('.png')?'89504e470d0a1a0a':'1a45dfa3';if(body.subarray(0,signature.length/2).toString('hex')!==signature)throw Error('Invalid artifact format');await writeFile(target,body,{flag:'wx'});}
 read(id,name){return readFile(this.locate(id,name));}
}
