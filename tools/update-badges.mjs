import {writeFile, readFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function visibleBadges(repo, release, runs) {
  const badges = [{key:'license',label:'license',value:'MIT',color:'#78a416',href:'LICENSE'}];
  const ci = runs?.workflow_runs?.[0];
  if(ci?.status === 'completed' && ci.conclusion === 'success') badges.push({key:'ci',label:'CI',value:'passing',color:'#438a16',href:`https://github.com/${repo.full_name}/actions`});
  if(typeof release?.tag_name === 'string' && release.tag_name.trim() && !release.draft && !release.prerelease) badges.push({key:'release',label:'release',value:release.tag_name,color:'#087ca7',href:`https://github.com/${repo.full_name}/releases`});
  if(typeof repo.pushed_at === 'string' && Number.isFinite(Date.parse(repo.pushed_at))) badges.push({key:'git',label:'Git',value:new Date(repo.pushed_at).toISOString().slice(0,10),color:'#087ca7',href:`https://github.com/${repo.full_name}/commits/${encodeURIComponent(repo.default_branch || 'main')}`});
  for(const [key,count,route] of [['stars',repo.stargazers_count,'stargazers'],['forks',repo.forks_count,'forks']]) {
    if(Number.isSafeInteger(count) && count > 0) badges.push({key,label:key === 'stars' ? 'Stars' : 'Forks',value:String(count),color:'#087ca7',href:`https://github.com/${repo.full_name}/${route}`});
  }
  return badges;
}
export function badgeSvg(badge) {
  const label=escape(badge.label), value=escape(badge.value);
  const left=Math.max(34,String(badge.label).length*7+12),right=Math.max(28,String(badge.value).length*7+12),width=left+right;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${value}"><title>${label}: ${value}</title><clipPath id="round"><rect width="${width}" height="20" rx="3"/></clipPath><g clip-path="url(#round)"><path fill="#555" d="M0 0h${width}v20H0z"/><path fill="${badge.color}" d="M${left} 0h${right}v20H${left}z"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="11"><text x="${left/2}" y="14">${label}</text><text x="${left+right/2}" y="14">${value}</text></g></svg>\n`;
}
export async function updateBadges(root, {repo,release,runs}) {
  const directory=path.join(root,'assets/support'); await mkdir(directory,{recursive:true});
  const badges=visibleBadges(repo,release,runs);
  for(const badge of badges) await writeFile(path.join(directory,`badge-${badge.key}.svg`),badgeSvg(badge));
  const block='<!-- public-badges:start -->\n'+badges.map(b=>`[![${b.label}](assets/support/badge-${b.key}.svg)](${b.href})`).join(' ')+'\n<!-- public-badges:end -->';
  for(const name of ['README.md','README.en-US.md','README.es-AR.md']) {
    const file=path.join(root,name), original=await readFile(file,'utf8');
    const pattern=original.includes('<!-- public-badges:start -->')?/<!-- public-badges:start -->[\s\S]*?<!-- public-badges:end -->/:/^\[!\[MIT\][^\r\n]*$/m;
    if(pattern.test(original)) await writeFile(file,original.replace(pattern,block));
    else {
      if(!/^# .+$/m.test(original)) throw Error('README heading missing: '+name);
      await writeFile(file,original.replace(/^# .+$/m, heading=>heading+'\n\n'+block));
    }
  }
  return badges.map(b=>b.key);
}
async function main() {
  const repository=process.env.GITHUB_REPOSITORY;
  if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository || '')) throw Error('GITHUB_REPOSITORY required');
  const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  if(process.env.GITHUB_TOKEN) headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
  const get=async(route,optional=false)=>{
    const response=await fetch('https://api.github.com/repos/'+repository+route,{headers,signal:AbortSignal.timeout(20000)});
    if(optional && response.status===404)return null;
    if(!response.ok) throw Error('GitHub API unavailable: '+response.status);
    return response.json();
  };
  // Fetch everything before writing: transient API/auth errors cannot erase valid metadata.
  const repo=await get('');
  const [release,runs]=await Promise.all([get('/releases/latest',true),get('/actions/workflows/ci.yml/runs?branch='+encodeURIComponent(repo.default_branch)+'&per_page=1',true)]);
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  console.log('Visible badges: '+(await updateBadges(root,{repo,release,runs})).join(', '));
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
