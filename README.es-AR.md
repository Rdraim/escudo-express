<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# escudo-express

Limitador de solicitudes por ventana fija y contador de respuestas fallidas para un único proceso de Node.js.

## Empezá acá

Necesitás Git y Node.js 22+ para las pruebas. Sin dependencias de ejecución. Descargá este repositorio; no instales un paquete homónimo sin verificar del registro npm.

```sh
git clone https://github.com/techrodrigo21-ux/escudo-express.git
cd escudo-express
npm test
node tools/check-public-content.mjs
```

Las importaciones del ejemplo funcionan desde la raíz del repositorio clonado. Para usar el módulo en otro proyecto, fijá una revisión Git (tag v1.2.0) o copiá el módulo conservando la licencia MIT. Esta documentación no afirma que exista una publicación en el registro npm.

```js
import { Limitador, escudo } from './src/index.js';
const limiter = new Limitador({ maxReq: 5, janelaMs: 1000 });
console.log(limiter.checar('clave-sintetica'));
// app.use(escudo({ maxReq: 100, janelaMs: 60_000 }));
```

## API

`Limitador({ janelaMs, maxReq, maxFalhas, bloqueioMs, loja, agora })`; `checar`, `registrarFalha`, `estaBloqueada`; `MemoriaTTL({ maxEntradas })`; `escudo({ chave, aoBloquear, aoErro, ...opcoes })`.

Los nombres públicos de funciones y opciones se mantienen en portugués por compatibilidad.

## Comportamiento y límites

Bloquea al SUPERAR `maxReq` o `maxFalhas` (intento N+1); las solicitudes no extienden la ventana. Las respuestas 401/403/404/429 son señales, no prueba de un ataque. Usa `req.ip` calculada por Express o la dirección del socket, sin leer directamente `X-Forwarded-For`. Configurá los proxies de confianza según tu topología. La memoria síncrona admite hasta 10000 entradas y genera un error al agotarse, sin eliminar bloqueos activos. El middleware responde 503 si falla la comprobación e informa mediante `aoErro(error)` opcional; también captura errores tardíos del contador de respuestas. Supervisá la capacidad. No incluye adaptador Redis, atomicidad distribuida ni protección entre procesos. No admite almacenes basados en Promises. Reiniciar borra los límites.

## Seguridad y compatibilidad

Sin confianza directa en cabeceras de proxy, con ventanas fijas y memoria limitada.

## Uso práctico — 1.2.0

Si un almacén devuelve una Promise, se rechaza y el middleware responde 503. Los fallos de los observadores no omiten bloqueos ni interrumpen el evento de finalización. El almacén de memoria sigue siendo de una sola instancia.

Ejemplo ejecutable con datos sintéticos: `node examples/uso.mjs`.

## Mantenimiento

Estos módulos independientes se inspiran en problemas resueltos en Nexus, proyecto de Rodrigo Rodrigues. No incluyen bases privadas, configuración de despliegue, logs, credenciales ni registros de usuarios. El mantenimiento coordinado consiste en revisar cambios relacionados en el mismo ciclo; no copia automáticamente archivos privados.

[Cómo contribuir](CONTRIBUTING.md) · [Seguridad](SECURITY.md)

MIT © Rodrigo Rodrigues

Referencia oficial: https://expressjs.com/en/guide/behind-proxies/

---

<p align="center">
  <img src="assets/support/banner-es-ar.svg" width="960" alt="Código abierto. Un café suma. Apoyá el trabajo de Rodrigo Rodrigues.">
</p>

## ☕ Invitame un café

¿Este proyecto te ayudó a resolver un problema, aprender algo nuevo o dar tus primeros pasos en desarrollo? Si querés apoyar mi trabajo, un café es una linda forma de agradecer.

Soy **Rodrigo Rodrigues**, creador de **Nexus** y de estos proyectos de código abierto. Tu aporte me ayuda a dedicar tiempo a mejorar el código, escribir ejemplos más claros y seguir compartiendo lo que aprendo.

**Aportá el monto que tenga sentido para vos. El apoyo es totalmente voluntario; el proyecto sigue siendo gratuito bajo la licencia MIT.**

[Apoyá con Pix](#apoyá-con-pix) · [Dejá un comentario](https://github.com/techrodrigo21-ux/escudo-express/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3)

### Apoyá con Pix

En la app de tu banco, escaneá el QR o copiá la clave Pix de abajo. Elegí el monto y revisá los datos del destinatario antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Pix original proporcionado por Rodrigo Rodrigues; también podés usar la clave de texto de abajo.">
</p>

**Clave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Pix es el sistema de pagos de Brasil. Si tu banco no lo admite, también podés ayudar compartiendo el proyecto, reportando un problema, mejorando la documentación o dejando un comentario.

### Tu comentario también suma

[Contame cómo te ayudó el proyecto](https://github.com/techrodrigo21-ux/escudo-express/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3). Me gustaría saber qué creaste, qué aprendiste y qué podría ser más claro para quienes recién empiezan.

Los comentarios son bienvenidos con o sin donación. Cuidá tu privacidad: no publiques comprobantes de pago, datos personales, credenciales ni información privada de usuarios en las Issues.

**Gracias por apoyar mi trabajo y ayudarme a seguir creando y compartiendo. ❤️**
