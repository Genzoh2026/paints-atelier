import {readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
async function check(dir){for(const item of await readdir(dir,{withFileTypes:true})){if(['.git','outputs','test-results','node_modules'].includes(item.name))continue;const file=path.join(dir,item.name);if(item.isDirectory())await check(file);else if(/\.(mjs|js)$/.test(file))execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}}
await check('.');console.log('All JavaScript syntax checks passed.');
