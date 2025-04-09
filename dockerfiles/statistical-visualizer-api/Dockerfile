###
# Dockerfile usado para consutruir la imagen del statistical-visualizer-api
#
# Antes de construir la imagen debemos haber compilado previamente el proyecto (desde el directorio raíz):
#
# mvn clean package
#
# A continuación podremos construir la imagen ejecutando siempre desde el directorio raíz del proyecto:
#
# docker build -f dockerfiles/statistical-visualizer-api/Dockerfile -t statistical-visualizer-api:<version> .
#
# Para ejecutar un contenedor asociado a esta imagen:
# docker run -i --rm -p 8080:8080 statistical-visualizer-api:<version>
#
# Para ejecutar con opciones de debug habilitadas:
# docker run -i --rm \
# -e JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,address=5005,server=y,suspend=n" \
# -p 8080:8080 \
# -p 5005:5005 \
# statistical-visualizer-api:<version>
###

FROM tomcat:9.0.98-jdk8
LABEL MAINTAINER=info@arte-consultores.com

RUN mkdir -p /data/edatos/statistical-visualizer-api/conf

COPY dockerfiles/statistical-visualizer-api/conf/*.xml /data/edatos/statistical-visualizer-api/conf/
COPY metamac-portal-api-web/target/*.war /usr/local/tomcat/webapps/statistical-visualizer-api.war

ENV LANG='es_ES.UTF-8'
ENV STATISTICAL_VISUALIZAZER_CONF_PATH='file:/data/edatos/statistical-visualizer-api/conf/environment.xml'

RUN env

CMD ["catalina.sh", "run"]