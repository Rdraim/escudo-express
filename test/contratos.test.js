import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escudo, Limitador } from '../src/index.js';
test('loja assíncrona não desativa silenciosamente a proteção', () => {
  const loja = { obter: () => Promise.resolve(null), definir() {} };
  assert.throws(() => new Limitador({ loja }).checar('example'), /síncrona/);
  const res = { end(s) { this.body = s; } };
  escudo({ loja, aoErro() { throw Error('observer'); } })({ ip: 'example' }, res, () => assert.fail('não deve passar'));
  assert.equal(res.statusCode, 503);
});
test('rejeições de observadores assíncronos não viram unhandled rejection', async () => {
  const proteger = escudo({ maxReq: 1, aoBloquear: async () => { throw Error('observer'); }, aoErro: async () => { throw Error('observer'); } });
  const res = { setHeader() {}, end() {} };
  proteger({ ip: 'example' }, res, () => {});
  proteger({ ip: 'example' }, res, () => assert.fail('blocked'));
  assert.equal(res.statusCode, 429);
  await new Promise((r) => setImmediate(r));
});
test('callbacks com falha não impedem resposta de bloqueio ou encerramento', () => {
  const proteger = escudo({ maxReq: 1, aoBloquear() { throw Error('observer'); }, aoErro() { throw Error('observer'); } });
  let finish;
  const res = { setHeader() {}, on(ev, f) { finish = f; }, end(s) { this.body = s; } };
  proteger({ ip: 'example' }, res, () => {});
  proteger({ ip: 'example' }, res, () => assert.fail('blocked'));
  assert.equal(res.statusCode, 429);
  assert.doesNotThrow(() => finish());
  const badKey = escudo({ chave() { throw Error('key'); } });
  badKey({}, res, () => assert.fail('key failure'));
  assert.equal(res.statusCode, 503);
});
