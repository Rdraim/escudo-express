import test from 'node:test';import assert from 'node:assert/strict';
import {visibleBadges,badgeSvg} from './update-badges.mjs';
const repo={full_name:'example/demo',stargazers_count:0,forks_count:0};
const release={tag_name:'v1.0.0',draft:false,prerelease:false};
const success={workflow_runs:[{status:'completed',conclusion:'success'}]};
test('zero and unavailable indicators stay out of README',()=>{
  assert.deepEqual(visibleBadges(repo,null,{workflow_runs:[{status:'completed',conclusion:'failure'}]}).map(x=>x.key),['license']);
});
test('positive counters appear independently and disappear when zero again',()=>{
  assert.deepEqual(visibleBadges({...repo,stargazers_count:2},release,success).map(x=>x.key),['license','ci','release','stars']);
  assert.deepEqual(visibleBadges({...repo,forks_count:3},null,null).map(x=>x.key),['license','forks']);
  assert.deepEqual(visibleBadges(repo,null,null).map(x=>x.key),['license']);
});
test('invalid counters, pending CI and prerelease are not advertised',()=>{
  const keys=visibleBadges({...repo,stargazers_count:-1,forks_count:NaN},{...release,prerelease:true},{workflow_runs:[{status:'in_progress',conclusion:null}]}).map(x=>x.key);
  assert.deepEqual(keys,['license']);
});
test('release text is escaped inside SVG',()=>{
 const svg=badgeSvg({label:'release',value:'<script>&"',color:'#087ca7'});
 assert.ok(!svg.includes('<script>'));assert.ok(svg.includes('&lt;script&gt;&amp;&quot;'));
});
