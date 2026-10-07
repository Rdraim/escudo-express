import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escudo, Limitador, MemoriaTTL } from '../src/index.js';
test('X-Forwarded-For não troca a chave de origem', () => {
  const mw = escudo({ maxReq: 1 });
  const res = () => ({ statusCode: 200, setHeader() {}, on() {}, end() {} });
  const a = { headers: { 'x-forwarded-for': '192.0.2.1' }, socket: { remoteAddress: '192.0.2.2' } };
  let chamados = 0; mw(a, res(), () => chamados++);
  mw({ ...a, headers: { 'x-forwarded-for': '192.0.2.3' } }, res(), () => chamados++);
  assert.equal(chamados, 1);
});
test('janela fixa não é prorrogada a cada requisição', () => {
  let t = 0; const lim = new Limitador({ maxReq: 3, janelaMs: 1000, agora: () => t });
  lim.checar('fixture'); t = 900; lim.checar('fixture'); t = 1000;
  assert.equal(lim.checar('fixture').restante, 2);
});
test('loja limitada preserva bloqueios e remove expirados ao atingir teto', () => {
  const loja = new MemoriaTTL({ maxEntradas: 1 });
  loja.definir('a', true, 10, 0);
  assert.throws(() => loja.definir('b', true, 10, 0));
  loja.definir('b', true, 10, 10);
  assert.equal(loja.m.size, 1);
  assert.equal(loja.obter('b', 10), true);
  for (const maxReq of [0, NaN, -1]) assert.throws(() => new Limitador({ maxReq }));
});
test('esgotamento responde 503 e erro tardio no finish não derruba o processo', () => {
  const loja = new MemoriaTTL({ maxEntradas: 1 });
  const erros = [];
  const mw = escudo({ loja, maxFalhas: 1, aoErro: (e) => erros.push(e) });
  let finish;
  const res = { statusCode: 401, setHeader() {}, on(_, fn) { finish = fn; }, end() {} };
  mw({ ip: '192.0.2.1' }, res, () => {});
  finish(); finish();
  assert.equal(erros.length, 1);
  const outro = { ...res, statusCode: 200 };
  mw({ ip: '192.0.2.2' }, outro, () => assert.fail('não deve liberar'));
  assert.equal(outro.statusCode, 503);
});
