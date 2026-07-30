# metamac-portal-web-client

## Desarrollo
Para el desarrollo del proyecto utilizar el fichero `src/main/preview.html`.

La aplicación no tiene página principal, por lo que hay que acceder directamente a un recurso. Alguno de los recursos disponibles son:

	src/main/preview.html#selection
	src/main/preview.html#visualization/table

Haciendo uso de una terminal nos situamos en el paquete o módulo de metamac-portal-web-client y escribimos el comando : **npm start**
En el fichero preview.html se encuentran una serie de valores para los endpoints se deberán modificar según la necesidad de usar local o un endpoint de demo, pre, etc.

## API
La aplicación de conecta a diferentes apis para consumir los datos. Las peticiones que hay que realizar son

**Shapes**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/~all/geoinfo?query=ID%20IN%20('GRAN_CANARIA',%20'TENERIFE')&_type=json]()

**Fecha de actualizacion shapes**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LA_GOMERA/geoinfo.json?fields=-geographicalGranularity,-geometry,-point]()

**Mundo**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/~all/variableelements?query=VARIABLE_TYPE%20EQ%20'GEOGRAPHICAL'%20AND
%20GEOGRAPHICAL_GRANULARITY_URN%20IS_NULL&limit=1]()

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO_MUNDO/variableelements/MUNDO/geoinfo.json]()


**Orden de granularidad geográfica**

*TODO: Falta consulta para averiguar el codelist con el orden de las granularidad geográficas*

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes?_type=json]()

# Fuentes
Las fuentes generadas, por su poca variabilidad, se están commiteando.

Para generar las fuentes se hace uso de la librería grunt-webfont.

Dada la complejidad y errores que pueden surgir de intentar hacerla funcionar en windows, se añade en /etc/docker/metamac-portal-web-client/grunt-webfont, un docker que hace de wrapper a la instalación de la librería y dependencias dentro del contendor

