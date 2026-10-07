<p align="right">
  <a href="COMPATIBILITY.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="COMPATIBILITY.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="COMPATIBILITY.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Compatibilidade

Núcleo sem dependências de runtime. Node.js 22 e 24 na CI. Instalação pelo Git; não há pacote deste projeto publicado no npm. Consulte Releases e fixe uma tag/commit ao integrar. Atualizações de dependências exigem análise de licença, engines e testes do consumidor. Um badge de CI não certifica segurança.

Revisão: 2026-10-07. ESM · MIT · Node.js >=22.

[Node.js releases](https://nodejs.org/en/about/previous-releases) · [GitHub Releases](https://github.com/Rdraim/escudo-express/releases)

Pacotes opcionais são adaptadores, não dependências obrigatórias. Verifique a versão fixada, licença e suporte antes da integração.

[README](README.md)

| Pacote | Versão (2026-10-07) | Requisito Node | Licença |
|---|---|---|---|
| [express](https://www.npmjs.com/package/express/v/5.2.1) | 5.2.1 | >= 18 | MIT |

Versões consultadas no registro oficial npm; sem engines declarado não significa compatibilidade garantida. Adaptadores opcionais não foram instalados nem validados contra serviços reais. Núcleo testado separadamente.

O consumidor Express deve resolver proxy-addr >=2.0.8 dentro da sua faixa compatível; essa versão corrige GHSA-jqcg-44mw-7w3h. Configure trust proxy para a topologia real e restrinja conexões diretas quando confiar em um número de saltos. Nunca use X-Forwarded-For não validado como identidade do limitador. O núcleo deste projeto não instala Express nem proxy-addr.

[proxy-addr 2.0.8](https://github.com/jshttp/proxy-addr/releases/tag/v2.0.8)

## Indicadores condicionais

O README usa SVGs locais gerados a partir da API oficial do GitHub. Stars e
Forks são independentes e só aparecem acima de zero. Release ausente ou CI
pendente/falho não gera badge; os resultados completos permanecem em Actions.
O workflow badges.yml atualiza após CI, release, estrela/fork e a cada seis
horas, além da execução manual. Não há troca instantânea em uma página já
aberta: recarregue após o commit automático. A agenda pode atrasar ou ser
desativada pelo GitHub por inatividade; consulte Actions nesse caso. Falha
transitória da API interrompe a atualização, preservando o último bloco válido.
O token temporário só publica README e SVGs, nunca dados privados.
