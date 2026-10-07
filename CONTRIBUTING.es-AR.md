<p align="right">
  <a href="CONTRIBUTING.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CONTRIBUTING.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CONTRIBUTING.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Contribuciones

Abrí una Issue con el objetivo y una reproducción mínima usando únicamente datos sintéticos. Usá una branch enfocada, conservá la API documentada y agregá pruebas de regresión para los errores.

Ejecutá las pruebas y el verificador de contenido antes de abrir un pull request:

```sh
npm test
node tools/check-public-content.mjs --history
```

Justificá las nuevas dependencias; no copies dependencias privadas de Nexus. Nunca envíes archivos .env, credenciales, dumps, logs, adjuntos reales, capturas internas ni copias del sistema privado. Antes de publicar, una persona debe revisar el diff y el historial.

Mantené un solo idioma por página. Actualizá las versiones en portugués brasileño, inglés de Estados Unidos y español argentino, con las banderas en la esquina superior derecha y enlaces al documento correspondiente en el mismo idioma.

[Volver al proyecto](README.es-AR.md) · [Seguridad](SECURITY.es-AR.md)
