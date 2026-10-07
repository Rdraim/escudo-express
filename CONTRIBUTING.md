<p align="right">
  <a href="CONTRIBUTING.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CONTRIBUTING.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CONTRIBUTING.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Contribuição

Abra uma Issue com objetivo e reprodução mínima usando somente dados sintéticos. Faça uma branch curta, preserve a API documentada e adicione testes de regressão para bugs.

Execute os testes e o verificador de conteúdo antes de abrir um pull request:

```sh
npm test
node tools/check-public-content.mjs --history
```

Dependências novas precisam de justificativa; não inclua dependências do Nexus privado. Nunca envie .env, credenciais, dumps, logs, anexos reais, capturas internas ou cópias do sistema privado. Publicações precisam de revisão humana do diff e do histórico.

Mantenha um único idioma por página. Atualize as versões em português brasileiro, inglês dos EUA e espanhol argentino, com as bandeiras no canto direito e links para o documento correspondente no mesmo idioma.

[Voltar ao projeto](README.md) · [Segurança](SECURITY.md)
