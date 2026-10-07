// Exemplo sintético / Synthetic example. No production access.
import { Limitador } from '../src/index.js';
const lim = new Limitador({ maxReq: 1 });
console.log(lim.checar('example'));
console.log(lim.checar('example'));
