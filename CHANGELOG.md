<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.2.0 — 2026-10-07

## 1.2.2 — 2026-10-07

O consumidor Express deve resolver proxy-addr >=2.0.8 dentro da sua faixa compatível; essa versão corrige GHSA-jqcg-44mw-7w3h. Configure trust proxy para a topologia real e restrinja conexões diretas quando confiar em um número de saltos. Nunca use X-Forwarded-For não validado como identidade do limitador. O núcleo deste projeto não instala Express nem proxy-addr.

## 1.2.1 — 2026-10-07

Identidade Rdraim, apresentação gráfica, revisão de compatibilidade e guarda do histórico mais eficiente. API de runtime preservada.

Loja que retorna Promise é rejeitada e o middleware responde 503. Falhas em observadores não impedem o bloqueio nem derrubam o evento de conclusão. Loja em memória continua limitada a uma instância.

# 1.1.0 — 2026-10-07

IP sem confiança em header bruto, janela fixa e memória limitada.

Documentação PT-BR/EN-US, apoio voluntário ainda sem canal de pagamento e verificações de publicação.
