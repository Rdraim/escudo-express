<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# escudo-express

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

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md)

Referência oficial: https://expressjs.com/en/guide/behind-proxies/


## Uso prático — 1.2.0

Loja que retorna Promise é rejeitada e o middleware responde 503. Falhas em observadores não impedem o bloqueio nem derrubam o evento de conclusão. Loja em memória continua limitada a uma instância.

Exemplo executável com dados sintéticos: `node examples/uso.mjs`.

---

<p align="center">
  <img src="assets/support/banner-pt-br.svg" width="960" alt="Código aberto. Um café faz diferença. Apoie o trabalho de Rodrigo Rodrigues.">
</p>

## ☕ Me pague um café

Este projeto te ajudou a resolver um problema, aprender algo novo ou dar os primeiros passos no desenvolvimento? Se você sentir vontade de apoiar meu trabalho, um café é uma forma carinhosa de agradecer.

Sou **Rodrigo Rodrigues**, criador do **Nexus** e destes projetos de código aberto. Seu apoio me ajuda a dedicar tempo para melhorar o código, escrever exemplos mais claros e continuar compartilhando o que aprendo.

**Contribua com o valor que fizer sentido para você. O apoio é totalmente voluntário — o projeto continua gratuito sob a licença MIT.**

<p>
  <a href="#apoie-com-pix"><img src="assets/support/pix-pt-br.svg" width="190" height="44" alt="Apoiar com Pix"></a>
  <a href="https://github.com/techrodrigo21-ux/escudo-express/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou"><img src="assets/support/comment-pt-br.svg" width="210" height="44" alt="Deixar um comentário"></a>
</p>

### Apoie com Pix

No aplicativo do seu banco, escaneie o QR Code ou copie a chave Pix abaixo. Escolha o valor e confira os dados do destinatário antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Code Pix original fornecido por Rodrigo Rodrigues; a chave em texto abaixo é uma alternativa.">
</p>

**Chave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Você também pode apoiar compartilhando o projeto, relatando um problema, melhorando a documentação ou deixando um comentário.

### Seu comentário também faz diferença

[Conte como o projeto te ajudou](https://github.com/techrodrigo21-ux/escudo-express/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou). Vou gostar de saber o que você criou, o que aprendeu e o que poderia ficar mais claro para quem está começando.

O comentário é bem-vindo com ou sem doação. Preserve sua privacidade: não publique comprovantes, dados pessoais, credenciais ou informações de usuários nas Issues.

---

**Obrigado por apoiar meu trabalho e me ajudar a continuar criando e compartilhando. ❤️**
