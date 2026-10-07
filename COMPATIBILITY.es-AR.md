<p align="right">
  <a href="COMPATIBILITY.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="COMPATIBILITY.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="COMPATIBILITY.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Compatibilidad

Núcleo sin dependencias de ejecución. CI con Node.js 22 y 24. Instalación desde Git; este proyecto no está publicado en npm. Revisá Releases y fijá una tag/commit al integrar. Actualizaciones requieren revisar licencia, engines y pruebas del consumidor. Un badge de CI no certifica seguridad.

Revisión: 2026-10-07. ESM · MIT · Node.js >=22.

[Node.js releases](https://nodejs.org/en/about/previous-releases) · [GitHub Releases](https://github.com/Rdraim/escudo-express/releases)

Los paquetes opcionales pertenecen a adaptadores, no al núcleo obligatorio. Verificá versión fijada, licencia y soporte antes de integrar.

[README](README.es-AR.md)

| Paquete | Versión (2026-10-07) | Requisito Node | Licencia |
|---|---|---|---|
| [express](https://www.npmjs.com/package/express/v/5.2.1) | 5.2.1 | >= 18 | MIT |

Versiones consultadas en el registro oficial npm; sin engines declarado no hay garantía de compatibilidad. Adaptadores opcionales no instalados ni validados con servicios reales. Núcleo probado por separado.

El consumidor Express debe resolver proxy-addr >=2.0.8 dentro de su rango compatible; corrige GHSA-jqcg-44mw-7w3h. Configurá trust proxy según la topología real y restringí conexiones directas cuando confiás en un número de saltos. Nunca uses X-Forwarded-For sin validar como identidad del limitador. El núcleo no instala Express ni proxy-addr.

[proxy-addr 2.0.8](https://github.com/jshttp/proxy-addr/releases/tag/v2.0.8)
