/* ============================================================================
   escudo-express — limite de taxa + detecção de abuso para Express/Connect.

   Duas defesas num middleware, sem dependência:
     1) LIMITE DE TAXA  — N requisições por janela, por chave (IP por padrão).
     2) DETECÇÃO DE ABUSO — muitas respostas de falha (401/403/404/429) na janela
        indicam brute force ou varredura de caminhos → bloqueia a chave por um tempo.

   Loja plugável (padrão: memória com expiração). Núcleo (`Limitador`) é puro e
   determinístico (relógio injetável), então dá para testar sem servidor.
   ============================================================================ */

/** Loja em memória com expiração por chave. Troque por Redis implementando a
 *  mesma interface { obter, definir }. */
export class MemoriaTTL {
  constructor() { this.m = new Map(); }
  obter(chave, agora) { const e = this.m.get(chave); if (!e) return null; if (e.exp <= agora) { this.m.delete(chave); return null; } return e.valor; }
  definir(chave, valor, ttlMs, agora) { this.m.set(chave, { valor, exp: agora + ttlMs }); }
  apagar(chave) { this.m.delete(chave); }
}

/** Núcleo puro: decide se a chave passa, e contabiliza falhas. */
export class Limitador {
  constructor({ janelaMs = 60000, maxReq = 100, maxFalhas = 10, bloqueioMs = 900000, loja = new MemoriaTTL(), agora = () => Date.now() } = {}) {
    Object.assign(this, { janelaMs, maxReq, maxFalhas, bloqueioMs, loja, agora });
  }
  _reg(chave) { return this.loja.obter(`r:${chave}`, this.agora()) || { reqs: 0, falhas: 0 }; }
  _salvar(chave, reg) { this.loja.definir(`r:${chave}`, reg, this.janelaMs, this.agora()); }

  /** Chamar a cada requisição. Devolve { permitido, motivo, restante, retryMs }. */
  checar(chave) {
    const t = this.agora();
    const bloqExp = this.loja.obter(`b:${chave}`, t);
    if (bloqExp) return { permitido: false, motivo: 'bloqueado', restante: 0, retryMs: bloqExp - t };
    const reg = this._reg(chave);
    reg.reqs += 1;
    this._salvar(chave, reg);
    if (reg.reqs > this.maxReq) { this._bloquear(chave); return { permitido: false, motivo: 'taxa', restante: 0, retryMs: this.bloqueioMs }; }
    return { permitido: true, motivo: '', restante: Math.max(0, this.maxReq - reg.reqs), retryMs: 0 };
  }

  /** Chamar quando a resposta foi uma falha suspeita (401/403/404/429). */
  registrarFalha(chave) {
    const reg = this._reg(chave);
    reg.falhas += 1;
    this._salvar(chave, reg);
    if (reg.falhas > this.maxFalhas) { this._bloquear(chave); return true; }
    return false;
  }
  _bloquear(chave) { this.loja.definir(`b:${chave}`, this.agora() + this.bloqueioMs, this.bloqueioMs, this.agora()); }
  estaBloqueada(chave) { return !!this.loja.obter(`b:${chave}`, this.agora()); }
}

const ipDe = (req) => (req.headers?.['x-forwarded-for']?.split(',')[0] || req.ip || req.socket?.remoteAddress || 'desconhecido').trim();
const FALHAS = new Set([401, 403, 404, 429]);

/**
 * Middleware. Opções do Limitador + `chave(req)` e `aoBloquear(req, info)`.
 */
export function escudo(opcoes = {}) {
  const { chave = ipDe, aoBloquear, ...resto } = opcoes;
  const lim = new Limitador(resto);
  return function escudoMiddleware(req, res, next) {
    const k = chave(req);
    const r = lim.checar(k);
    res.setHeader && res.setHeader('X-RateLimit-Remaining', String(r.restante));
    if (!r.permitido) {
      aoBloquear && aoBloquear(req, r);
      res.setHeader && res.setHeader('Retry-After', String(Math.ceil(r.retryMs / 1000)));
      res.statusCode = 429;
      return res.end ? res.end('Too Many Requests') : next(new Error('rate-limited'));
    }
    res.on && res.on('finish', () => { if (FALHAS.has(res.statusCode)) lim.registrarFalha(k); });
    next();
  };
}

export default escudo;
