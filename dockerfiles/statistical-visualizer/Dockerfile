###
# Dockerfile usado para consutruir la imagen del statistical-visualizer
#
# Antes de construir la imagen debemos haber compilado previamente el proyecto (desde el directorio raíz):
#
# mvn clean package
#
# A continuación podremos construir la imagen ejecutando siempre desde el directorio raíz del proyecto:
#
# docker build -f dockerfiles/statistical-visualizer/Dockerfile -t statistical-visualizer:<version> .
#
# Para ejecutar un contenedor asociado a esta imagen:
# docker run -i --rm -p 8080:8080 statistical-visualizer:<version>
#
# Para ejecutar con opciones de debug habilitadas:
# docker run -i --rm \
# -e JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,address=5005,server=y,suspend=n" \
# -p 8080:8080 \
# -p 5005:5005 \
# statistical-visualizer:<version>
###

FROM tomcat:9.0.98-jdk8
LABEL MAINTAINER=info@arte-consultores.com

RUN mkdir -p /data/edatos/statistical-visualizer/conf

COPY dockerfiles/statistical-visualizer/conf/*.xml /data/edatos/statistical-visualizer/conf/
COPY metamac-portal-web/target/*.war /usr/local/tomcat/webapps/statistical-visualizer.war

ENV LANG='es_ES.UTF-8'
ENV STATISTICAL_VISUALIZAZER_CONF_PATH='file:/data/edatos/statistical-visualizer/conf/environment.xml'

RUN env

CMD ["catalina.sh", "run"]