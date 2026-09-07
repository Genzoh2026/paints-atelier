import {fileURLToPath} from 'node:url';
import {createServer} from './server/http.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.PORT||4180);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be between 1 and 65535');
const server=createServer(root);
server.on('error',error=>{console.error(`Cannot start Paints Atelier: ${error.message}`);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Paints Atelier: http://127.0.0.1:${port}\nFiles are saved under outputs/. Press Ctrl+C to stop.`));
