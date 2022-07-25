# Wrapper para grunt-webfont

- Hacemos *docker build -t grunt-webfont .* para descargar el docker con la última versión de grunt-webfont y fontforge
- En caso de usar docker for windows basado en Virtualbox: Compartimos desde VirtualBox en la docker-machine (*default*) carpeta permanente, automontable, "w" con la ruta "W:\" en la máquina default asociada a docker, para que desde dentro sea accesible la ruta /w/ISTAC/2010-metamac/04-git/metamac-portal/metamac-portal-web-client/
- En este punto, ejecutamos *bash grunt-webfont.sh* desde git bash por ejemplo. Contiene simplemente los parámetros para lanzar el contenedor de docker y ejecutar la tarea grunt webfont
- Si hubiera fallos, probar con un único svg e ir avanzando, hay ocasiones en las que un único archivo svg con errores paraliza todo el proceso
- A la hora de generar, añadirá un // Bootstrap overrides dentro de icons.less. El mismo no hemos de añadirlo, pues ya está dentro de fontface.less, encapsulado en una clase css más especifica