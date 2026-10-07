<p align="right">
  <a href="CONTRIBUTING.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CONTRIBUTING.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CONTRIBUTING.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Contributing

Open an Issue describing the goal and a minimal reproduction with synthetic data only. Use a focused branch, preserve the documented API, and add regression tests for bugs.

Run tests and the content checker before opening a pull request:

```sh
npm test
node tools/check-public-content.mjs --history
```

Justify new dependencies; do not copy private Nexus dependencies. Never submit .env files, credentials, dumps, logs, real attachments, internal screenshots or private system copies. Review the diff and history before publishing.

Keep one language per page. Update the Brazilian Portuguese, US English and Argentine Spanish versions, with flags in the upper-right corner and links to the corresponding document in the same language.

[Back to the project](README.en-US.md) · [Security](SECURITY.en-US.md)
