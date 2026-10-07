# escudo-express

[English (United States)](README.en-US.md) · [Apoio voluntário](SUPPORT.md)

## Segurança e compatibilidade

IP sem confiança em header bruto, janela fixa e memória limitada.

Bloqueia ao EXCEDER `maxReq` ou `maxFalhas` (a tentativa N+1); a janela não se prolonga a cada acesso. Falhas 401/403/404/429 são sinais, não prova de ataque. Por padrão usa `req.ip` calculado pelo Express ou IP do socket, nunca `X-Forwarded-For` bruto. Configure proxies confiáveis conforme sua topologia. Loja síncrona em memória, teto de 10000 entradas; esgotamento lança erro sem remover bloqueios ativos. Encaminhe erros para tratamento 503 e monitore capacidade. Não há adaptador Redis, atomicidade distribuída ou proteção entre processos; não passe Promises como loja. Reiniciar limpa limites.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.2.0) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Limite de taxa **e** detecção de abuso num só middleware para Express/Connect.
Sem dependências.

Duas defesas:

1. **Limite de taxa** — no máximo `maxReq` requisições por janela, por chave (IP
   por padrão). Passou, responde `429` com `Retry-After`.
2. **Detecção de abuso** — muitas respostas de falha (`401/403/404/429`) na janela
   indicam *brute force* ou varredura de caminhos; a chave é bloqueada por um tempo.

O núcleo (`Limitador`) é puro e determinístico (relógio injetável) — fácil de
testar e de portar. A loja é plugável (padrão em memória; a interface atual é síncrona e não aceita Redis assíncrono).

## Instalação

```bash
git clone https://github.com/techrodrigo21-ux/escudo-express.git
cd escudo-express
npm test
```

## Uso

```js
import express from 'express';
import { escudo } from './src/index.js';

const app = express();
app.use(escudo({
  janelaMs: 60_000,   // janela de 1 min
  maxReq: 100,        // 100 req/min por IP
  maxFalhas: 10,      // mais de 10 falhas 4xx/min → bloqueia
  bloqueioMs: 15 * 60_000,
  aoBloquear: (req, info) => console.warn('bloqueado', req.ip, info.motivo),
}));
```

Atrás de proxy, configure apenas proxies confiáveis conforme sua topologia, ou passe sua
própria função `chave(req)` (ex.: por usuário autenticado).

## Núcleo testável

```js
import { Limitador } from './src/index.js';
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

## Manutenção e apoio

Código independente inspirado em problemas resolvidos no Nexus, projeto de Rodrigo Rodrigues. Não inclui banco, configuração privada, logs, dados de usuários ou credenciais. Evolução coordenada significa revisar mudanças relacionadas no mesmo ciclo; não há cópia automática de arquivos privados.

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md) · [Apoio voluntário](SUPPORT.md)

Referência oficial: https://expressjs.com/en/guide/behind-proxies/


## Uso prático — 1.2.0

Loja que retorna Promise é rejeitada e o middleware responde 503. Falhas em observadores não impedem o bloqueio nem derrubam o evento de conclusão. Loja em memória continua limitada a uma instância.

Exemplo executável com dados sintéticos: `node examples/uso.mjs`.
