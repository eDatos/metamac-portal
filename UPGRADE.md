# UPGRADE - Proceso de actualización entre versiones

*Para actualizar de una versión a otra es suficiente con actualizar el WAR a la última versión. El siguiente listado presenta aquellos cambios de versión en los que no es suficiente con actualizar y que requieren por parte del instalador tener más cosas en cuenta. Si el cambio de versión engloba varios cambios de versión del listado, estos han de ejecutarse en orden de más antiguo a más reciente.*

*De esta forma, si tuviéramos una instalación en una versión **A.B.C** y quisieramos actualizar a una versión posterior **X.Y.Z** para la cual existan versiones anteriores que incluyan cambios listados en este documento, se deberá realizar la actualización pasando por todas estas versiones antes de poder llegar a la versión deseada.*

*EJEMPLO: Queremos actualizar desde la versión 1.0.0 a la 3.0.0 y existe un cambio en la base de datos en la actualización de la versión 1.0.0 a la 2.0.0.*

*Se deberá realizar primero la actualización de la versión 1.0.0 a la 2.0.0 y luego desde la 2.0.0 a la 3.0.0*

## 8.2.2 a 8.2.3-SNAPSHOT
* Es necesario ejecutar los scripts SQL contenidos en la carpeta

```
etc/changes-from-release/8.2.2/db/common-metadata/postgresql/*.sql
```
* Importante: Esta versión depende de la versión complementos-apps - 5.0.3-SNAPSHOT para ajustar del todo ciertos estilos.

## 8.0.0 a 8.1.0
* Es necesario ejecutar los scripts SQL contenidos en la carpeta

```
etc/changes-from-release/8.0.0/db/common-metadata/postgresql/*.sql
```
* Importante: Esta versión depende de la versión complementos-apps - 5.0.0 para poder dibujar correctamente las migas de pan del visualizador en entornos ISTAC

## 7.1.3 a 8.0.0
* A partir de esta versión de la aplicación se elimina el soporte para bases de datos Oracle o Sql Server, siendo PostgreSQL la única base de datos con soporte.
* Es necesario ejecutar los scripts SQL contenidos en la carpeta

```
etc/changes-from-release/7.1.3/db/common-metadata/postgresql/*.sql
```

## 7.0.0 a 7.0.1
* La dependencia de edatos-external-users pasa de obligatoria a opcional. El modo de indicarlo es que las siguientes propiedades no estén inicializadas. 

* Debido a que la funcionalidad del captcha se ha movido a external-users, dicha funcionalidad estará deshabilitada si edatos-external-users no está instalado.

```
    metamac.edatos_external_users.rest.external
    metamac.edatos_external_users.web.external.url
    metamac.portal.rest.external.authentication.captcha.url
```

## 6.8.1 a 7.0.0

* A partir de esta versión portal se integra con edatos-external-users. Para aprovechar estas funcionalidades asegúrese de que dicho proyecto esta instalado. En caso contrario simplemente no aparecerán. 
* A partir de esta versión portal se integra con el captcha edatos-external-users. Para aprovechar estas funcionalidades asegúrese de que dicho proyecto esta instalado.

## 0.0.0 a 6.7.3
* El proceso de actualizaciones entre versiones para versiones anteriores a la 6.7.3 está definido en "Metamac - Manual de instalación.doc"
