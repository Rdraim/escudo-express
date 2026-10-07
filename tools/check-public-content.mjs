/** Heuristic publication guard. It does not replace a manual/history review. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const list = git('ls-files', '-z').split('\0').filter(Boolean);
const forbiddenPath = /(^|\/)(?:\.env(?:\..*)?|dados|uploads|restrito|backup|node_modules)(\/|$)|\.(?:pem|key|p12|pfx|bson|db|sqlite|log|dump)$/i;
const markers = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql):\/\/[^\s/]+:[^\s/@]+@/i,
  /https?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/,
  /[a-z0-9.-]+\.(?:local|internal)\b/i,
];
let failures = 0;
function check(name, content, label) {
  if (forbiddenPath.test(name) || markers.some((re) => re.test(content))) {
    console.error(`Review required / Revisão necessária: ${label}:${name}`);
    failures++;
  }
}
for (const name of list) {
  check(name, readFileSync(name, 'utf8'), 'worktree');
}
if (process.argv.includes('--history')) {
  for (const commit of git('rev-list', '--all').trim().split('\n').filter(Boolean)) {
    for (const name of git('ls-tree', '-r', '--name-only', '-z', commit).split('\0').filter(Boolean)) {
      check(name, git('show', `${commit}:${name}`), commit.slice(0, 8));
    }
  }
}
if (failures) process.exitCode = 1;
else console.log(`Public content guard passed / Verificador aprovado (${list.length} tracked files). Manual review still required.`);
