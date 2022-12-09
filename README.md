
# Barrani 20000

Pequeño script para generar facturas electrónicas en lote para Argentina

## Instrucciones

- Descargar proyecto.
- En src/index.js colocar tu CUIT y modica todo lo que cuadre a tu caso.
- Crear carpeta `res` en el root path del proyecto (está excluida en .gitignore).
- En `res` colocar tu certificado y clave privada como archivos `res/cert.crt` y `private.key` correspondientemente. O si preferís modificá lo que gustes en `index/src.js`
- Crear un json `res/transactions.json` con una estructura similar a `res/transactions.json.sample`. **Si es una factura por 20000 crocantes, solo necesitás poner la fecha en formato `yyyy-mm-dd`, sino un object con properties `date` y `amount` (ver res/transactions.json.sample para ver un ejemplo)**
- npm start

Van a ver en su carpeta `res` una folder `facturas` con sus CAEs.

## Homologacion

Si primero quieren testear en homologacion, poner en src/index.js la option `production` a false.

### Consideraciones

El script es super sencillo, no me la quise complicar, no tiene validaciones, las hace el WS de la AFIP y van a ver los errores posibles por consola.
