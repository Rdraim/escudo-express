import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escudo, Limitador, MemoriaTTL } from '../src/index.js';

// Loja síncrona que anota cada chave lida/gravada, para provar o formato.
const lojaEspia = () => {
  const base = new MemoriaTTL();
  const chaves = new Set();
  return {
    chaves,
    m: base.m,
    obter(k, t) { chaves.add(k); return base.obter(k, t); },
    definir(k, v, ttl, t) { chaves.add(k); return base.definir(k, v, ttl, t); },
  };
};
const resposta = (statusCode = 200) => ({ statusCode, headers: {}, setHeader(k, v) { this.headers[k] = v; }, on(_, fn) { this.finish = fn; }, end() { this.ended = true; } });

test('padrão sem prefixo mantém as chaves r:<chave> e b:<chave> de antes', () => {
  for (const opcoes of [{}, { prefixo: '' }]) {
    const loja = lojaEspia();
    const lim = new Limitador({ maxReq: 1, agora: () => 0, loja, ...opcoes });
    lim.checar('fixture'); lim.checar('fixture');
    assert.deepEqual([...loja.m.keys()].sort(), ['b:fixture', 'r:fixture']);
    assert.equal(lim.prefixo, '');
  }
});

test('sem prefixo, duas instâncias na mesma loja misturam contagem e bloqueio', () => {
  const loja = new MemoriaTTL();
  const geral = new Limitador({ maxReq: 600, loja, agora: () => 0 });
  const login = new Limitador({ maxReq: 2, loja, agora: () => 0 });
  for (let i = 0; i < 5; i++) geral.checar('192.0.2.1');
  assert.equal(login.checar('192.0.2.1').permitido, false); // chega estourado
  assert.equal(geral.estaBloqueada('192.0.2.1'), true);     // e o bloqueio vaza
});

test('com prefixos próprios, a loja compartilhada guarda contagens independentes', () => {
  const loja = lojaEspia();
  const geral = new Limitador({ maxReq: 600, loja, agora: () => 0, prefixo: 'geral' });
  const login = new Limitador({ maxReq: 2, loja, agora: () => 0, prefixo: 'login' });
  for (let i = 0; i < 5; i++) geral.checar('192.0.2.1');
  assert.deepEqual(login.checar('192.0.2.1'), { permitido: true, motivo: '', restante: 1, retryMs: 0 });
  login.checar('192.0.2.1');
  assert.equal(login.checar('192.0.2.1').motivo, 'taxa');
  assert.equal(login.estaBloqueada('192.0.2.1'), true);
  assert.equal(geral.estaBloqueada('192.0.2.1'), false);
  assert.equal(geral.checar('192.0.2.1').restante, 600 - 6);
  for (let i = 0; i < 3; i++) geral.registrarFalha('192.0.2.1');
  assert.equal(loja.m.get('login|r:192.0.2.1').valor.falhas, 0);
  assert.deepEqual([...loja.m.keys()].sort(), ['geral|r:192.0.2.1', 'login|b:192.0.2.1', 'login|r:192.0.2.1']);
});

test('escudo() repassa o prefixo: geral e login isolados na mesma loja', () => {
  const loja = new MemoriaTTL();
  const geral = escudo({ loja, maxReq: 600, prefixo: 'geral' });
  const login = escudo({ loja, maxReq: 2, maxFalhas: 1, prefixo: 'login' });
  const req = { ip: '192.0.2.10' };
  for (let i = 0; i < 5; i++) geral(req, resposta(), () => {});
  const r1 = resposta(401); let passou = 0;
  login(req, r1, () => passou++);
  assert.equal(r1.headers['X-RateLimit-Remaining'], '1');
  r1.finish();
  const r2 = resposta(401); login(req, r2, () => passou++); r2.finish(); // 2a falha > maxFalhas
  const r3 = resposta(); login(req, r3, () => passou++);
  assert.equal(passou, 2);
  assert.equal(r3.statusCode, 429);
  const r4 = resposta(); geral(req, r4, () => passou++);
  assert.equal(passou, 3);
  assert.equal(r4.headers['X-RateLimit-Remaining'], String(600 - 6));
  assert.ok(loja.m.has('login|b:192.0.2.10'));
  assert.ok(!loja.m.has('b:192.0.2.10') && !loja.m.has('geral|b:192.0.2.10'));
});

test('prefixos não colidem com chaves arbitrárias nem entre si', () => {
  const loja = new MemoriaTTL();
  const semPrefixo = new Limitador({ maxReq: 1, loja, agora: () => 0 });
  const comR = new Limitador({ maxReq: 1, loja, agora: () => 0, prefixo: 'r' });
  const comB = new Limitador({ maxReq: 1, loja, agora: () => 0, prefixo: 'b|r' });
  // Chaves escolhidas para imitar o formato das outras instâncias.
  semPrefixo.checar('x'); semPrefixo.checar('x');
  assert.equal(comR.checar('x').permitido, true);
  assert.equal(comB.checar('x').permitido, true);
  assert.equal(semPrefixo.checar('|r:x').permitido, true);
  assert.deepEqual([...loja.m.keys()].sort(), ['b:x', 'b|r|r:x', 'r:x', 'r:|r:x', 'r|r:x']);
});

test('prefixo inválido é recusado na construção', () => {
  for (const prefixo of [null, 1, {}, 'a:b', ':']) {
    assert.throws(() => new Limitador({ prefixo }), TypeError);
    assert.throws(() => escudo({ prefixo }), TypeError);
  }
});
