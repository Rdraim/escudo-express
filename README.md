# escudo-express

Limite de taxa **e** detecção de abuso num só middleware para Express/Connect.
Sem dependências.

Duas defesas:

1. **Limite de taxa** — no máximo `maxReq` requisições por janela, por chave (IP
   por padrão). Passou, responde `429` com `Retry-After`.
2. **Detecção de abuso** — muitas respostas de falha (`401/403/404/429`) na janela
   indicam *brute force* ou varredura de caminhos; a chave é bloqueada por um tempo.

O núcleo (`Limitador`) é puro e determinístico (relógio injetável) — fácil de
testar e de portar. A loja é plugável (padrão em memória; implemente a mesma
interface para usar Redis).

## Instalação

```bash
npm install escudo-express
```

## Uso

```js
import express from 'express';
import { escudo } from 'escudo-express';

const app = express();
app.use(escudo({
  janelaMs: 60_000,   // janela de 1 min
  maxReq: 100,        // 100 req/min por IP
  maxFalhas: 10,      // 10 falhas 4xx/min → bloqueia
  bloqueioMs: 15 * 60_000,
  aoBloquear: (req, info) => console.warn('bloqueado', req.ip, info.motivo),
}));
```

Atrás de proxy, garanta o IP real (`app.set('trust proxy', 1)`), ou passe sua
própria função `chave(req)` (ex.: por usuário autenticado).

## Núcleo testável

```js
import { Limitador } from 'escudo-express';
const lim = new Limitador({ maxReq: 5, janelaMs: 1000 });
lim.checar('chave');          // { permitido, motivo, restante, retryMs }
lim.registrarFalha('chave');  // contabiliza falha; bloqueia ao exceder
```

> Não é um WAF. É a primeira linha contra força bruta e varredura — ajuste os
> limites ao seu tráfego e combine com autenticação forte e `headers-seguros`.

## Testes

```bash
npm test
```

## Licença

MIT © Rodrigo Rodrigues
