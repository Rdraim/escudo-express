import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Limitador, MemoriaTTL, escudo } from '../src/index.js';

const relogio = (t0 = 0) => { const o = { t: t0 }; o.agora = () => o.t; o.avancar = (ms) => (o.t += ms); return o; };

test('limite de taxa: bloqueia ao passar de maxReq na janela', () => {
  const c = relogio();
  const lim = new Limitador({ maxReq: 3, janelaMs: 1000, bloqueioMs: 5000, agora: c.agora });
  for (let i = 0; i < 3; i++) assert.equal(lim.checar('ip').permitido, true);
  const r = lim.checar('ip');
  assert.equal(r.permitido, false);
  assert.equal(r.motivo, 'taxa');
});

test('janela expira e libera', () => {
  const c = relogio();
  const lim = new Limitador({ maxReq: 2, janelaMs: 1000, bloqueioMs: 100, agora: c.agora });
  lim.checar('ip'); lim.checar('ip');
  assert.equal(lim.checar('ip').permitido, false);
  c.avancar(1100);                       // janela e bloqueio expiram
  assert.equal(lim.checar('ip').permitido, true);
});

test('detecção de abuso: muitas falhas bloqueiam a chave', () => {
  const c = relogio();
  const lim = new Limitador({ maxReq: 1000, maxFalhas: 3, bloqueioMs: 5000, agora: c.agora });
  assert.equal(lim.estaBloqueada('ip'), false);
  for (let i = 0; i < 3; i++) lim.registrarFalha('ip');
  const bloqueou = lim.registrarFalha('ip');      // a 4a passa do limite
  assert.equal(bloqueou, true);
  assert.equal(lim.estaBloqueada('ip'), true);
  assert.equal(lim.checar('ip').permitido, false);
});

test('chaves diferentes são independentes', () => {
  const c = relogio();
  const lim = new Limitador({ maxReq: 1, janelaMs: 1000, agora: c.agora });
  assert.equal(lim.checar('a').permitido, true);
  assert.equal(lim.checar('a').permitido, false);
  assert.equal(lim.checar('b').permitido, true);
});

test('middleware responde 429 quando bloqueado', () => {
  const mw = escudo({ maxReq: 1, janelaMs: 1000, chave: () => 'x' });
  const mkRes = () => ({ headers: {}, statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, on() {}, end() { this.ended = true; } });
  let next1 = false; mw({ headers: {} }, mkRes(), () => (next1 = true));
  assert.equal(next1, true);
  const res2 = mkRes(); let next2 = false; mw({ headers: {} }, res2, () => (next2 = true));
  assert.equal(res2.statusCode, 429);
  assert.equal(next2, false);
  assert.ok(res2.headers['Retry-After']);
});
