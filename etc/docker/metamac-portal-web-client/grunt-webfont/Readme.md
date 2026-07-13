# Wrapper para grunt-webfont

- `cd .\etc\docker\metamac-portal-web-client\grunt-webfont\`
- Hacemos `docker build -t grunt-webfont .` para descargar el docker con la última versión de grunt-webfont y fontforge
- En caso de usar docker for windows basado en Virtualbox: Compartimos desde VirtualBox en la docker-machine (*default*) carpeta permanente, automontable, "w" con la ruta "W:\" en la máquina default asociada a docker, para que desde dentro sea accesible la ruta /w/ISTAC/2010-metamac/04-git/metamac-portal/metamac-portal-web-client/
- En este punto, ejecutamos `bash grunt-webfont.sh` desde git bash por ejemplo. Contiene simplemente los parámetros para lanzar el contenedor de docker y ejecutar la tarea grunt webfont
- `grunt build` (que es la tarea por defecto, ejecutada también por `mvn clean install`) incluye la tarea `webfont` automáticamente. Este wrapper solo es necesario en entornos donde fontforge no está disponible localmente (p. ej. Windows)
- Si hubiera fallos, probar con un único svg e ir avanzando, hay ocasiones en las que un único archivo svg con errores paraliza todo el proceso
- La generación usa una plantilla personalizada (`src/main/fonts/icons-template.less`) que produce `icons.less` con el `@font-face` y los iconos encapsulados bajo `.visualizer-wrapper`. No es necesario editar `icons.less` manualmente tras la generación

### Notas

- - Las webfonts no se llevan bien con el texto en el SVG. No use textos, en su lugar, conviertalo a trazos _(paths)_.
- Algunos recomiendan, entre otras cosas, un tamaño de 1000 x 1000 para el lienzo. https://web.archive.org/web/20171021024323/http://understandinglimited.com/2007/10/29/inscape2fontforge/
- Parece que grunt-webfont se comporta mejor con las figuras sólidas que con los trazos a la hora de representar la misma figura, pero esto no se ha probado en profundidad.
- A la hora de realizar los iconos en svg, al combinar figuras, es mejor que la figura que se sustrae sea blanca en vez de negra, o en IE dara problemas.
- Causa probable de error: una figura con path interior en vez de dos objetos uno la resta del otro.
- Los SVG que en realidad son imágenes incrustadas no son un formato válido. Ha de ser un vector.