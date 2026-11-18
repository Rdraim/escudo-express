<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

Nueva opción `prefixo` en `Limitador` y `escudo()` para instancias que comparten el mismo almacén. Sin ella, un límite general y otro más estricto (por ejemplo, login) montados sobre el mismo almacén sumaban sus conteos y compartían los bloqueos, y el estricto llegaba ya agotado. Con prefijo, las claves pasan a ser `<prefijo>|r:<clave>` y `<prefijo>|b:<clave>`; el prefijo no admite `:` y un prefijo inválido genera `TypeError`. El valor predeterminado `''` conserva las claves `r:<clave>` y `b:<clave>` y el comportamiento de la 1.2.x. Al compartir un almacén entre instancias, dale a cada una su propio prefijo. Sin persistencia nueva ni cambios en la interfaz síncrona del almacén.

# 1.2.0 — 2026-10-07

## 1.2.2 — 2026-10-07

El consumidor Express debe resolver proxy-addr >=2.0.8 dentro de su rango compatible; corrige GHSA-jqcg-44mw-7w3h. Configurá trust proxy según la topología real y restringí conexiones directas cuando confiás en un número de saltos. Nunca uses X-Forwarded-For sin validar como identidad del limitador. El núcleo no instala Express ni proxy-addr.

## 1.2.1 — 2026-10-07

Identidad Rdraim, presentación gráfica, revisión de compatibilidad y control de historial más eficiente. API de ejecución conservada.

Si un almacén devuelve una Promise, se rechaza y el middleware responde 503. Los fallos de los observadores no omiten bloqueos ni interrumpen el evento de finalización. El almacén de memoria sigue siendo de una sola instancia.

# 1.1.0 — 2026-10-07

Sin confianza directa en cabeceras de proxy, con ventanas fijas y memoria limitada.

Documentación en portugués brasileño e inglés de Estados Unidos, apoyo voluntario todavía sin canal de pago en esa versión y verificaciones de publicación.
