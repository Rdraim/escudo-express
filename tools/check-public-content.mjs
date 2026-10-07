/** Heuristic guard, including every reachable historical blob. Manual review remains required. */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const git=(args,extra={})=>execFileSync('git',args,{maxBuffer:64*1024*1024,...extra});
const paths=git(['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const forbidden=/(^|\/)(?:\.env(?:\..*)?|dados|uploads|restrito|backup|node_modules)(\/|$)|\.(?:pem|key|p12|pfx|bson|db|sqlite|log|dump)$/i;
const markers=[/-----BEGIN [A-Z ]*PRIVATE KEY-----/,/(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql):\/\/[^\s/]+:[^\s/@]+@/i,/https?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/,/[a-z0-9.-]+\.(?:local|internal)\b/i];
let failures=0;
function check(name,bytes,label){if(forbidden.test(name)||markers.some(r=>r.test(bytes.toString('utf8')))){console.error(`Review required: ${label}:${name}`);failures++;}}
for(const name of paths)check(name,readFileSync(name),'worktree');
if(process.argv.includes('--history')){
 const commits=git(['rev-list','--all'],{encoding:'utf8'}).trim();
 if(commits){
  // Check all historical names, including a renamed identical blob.
  for(const name of new Set(git(['log','--all','--format=','--name-only'],{encoding:'utf8'}).split('\n').filter(Boolean)))if(forbidden.test(name)){console.error(`Review required: historical path:${name}`);failures++;}
  const objects=git(['rev-list','--objects','--all'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  const names=new Map(objects.map(l=>{const [id,...p]=l.split(' ');return [id,p.join(' ')];}));
  const data=git(['cat-file','--batch'],{input:objects.map(l=>l.split(' ')[0]).join('\n')+'\n'});
  let pos=0;
  while(pos<data.length){
   const end=data.indexOf(10,pos);if(end<0)throw new Error('Incomplete Git batch');
   const [id,type,length]=data.subarray(pos,end).toString().split(' ');const size=Number(length);
   if(!Number.isSafeInteger(size)||size<0)throw new Error('Invalid Git batch');
   const start=end+1,stop=start+size;if(stop>=data.length)throw new Error('Truncated Git object');
   if(type==='blob')check(names.get(id)||id,data.subarray(start,stop),id.slice(0,8));
   pos=stop+1;
  }
 }
}
if(failures)process.exitCode=1;
else console.log(`Public content guard passed (${paths.length} tracked files). Manual review remains required.`);
