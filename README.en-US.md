# escudo-express

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.md)

A fixed-window rate limiter and response-failure counter for a single Node.js process.

## Start here

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/escudo-express.git
cd escudo-express
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { Limitador, escudo } from './src/index.js';
const limiter = new Limitador({ maxReq: 5, janelaMs: 1000 });
console.log(limiter.checar('synthetic-key'));
// app.use(escudo({ maxReq: 100, janelaMs: 60_000 }));
```

## API

`Limitador({ janelaMs, maxReq, maxFalhas, bloqueioMs, loja, agora })`; `checar`, `registrarFalha`, `estaBloqueada`; `MemoriaTTL({ maxEntradas })`; `escudo({ chave, aoBloquear, aoErro, ...opcoes })`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

Blocks when `maxReq` or `maxFalhas` is EXCEEDED (attempt N+1); requests do not extend the window. 401/403/404/429 responses are signals, not proof of an attack. Defaults to Express-computed `req.ip` or socket address; never reads raw `X-Forwarded-For`. Configure trusted proxies for your actual topology. The synchronous memory store holds up to 10000 entries and throws on exhaustion without evicting active blocks. The middleware responds with 503 for check failures and reports through optional `aoErro(error)`; late response-counter errors are caught. Monitor capacity. No Redis adapter, distributed atomicity or cross-process protection is provided; Promise-based stores are unsupported. Restarting clears limits.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Version 1.1.0

No raw proxy-header trust, fixed windows and bounded memory.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.md)

MIT © Rodrigo Rodrigues

Official reference: https://expressjs.com/en/guide/behind-proxies/
