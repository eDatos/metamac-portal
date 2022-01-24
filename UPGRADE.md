# UPGRADE - Proceso de actualización entre versiones

*Para actualizar de una versión a otra es suficiente con actualizar el WAR a la última versión. El siguiente listado presenta aquellos cambios de versión en los que no es suficiente con actualizar y que requieren por parte del instalador tener más cosas en cuenta. Si el cambio de versión engloba varios cambios de versión del listado, estos han de ejecutarse en orden de más antiguo a más reciente.*

*De esta forma, si tuviéramos una instalación en una versión **A.B.C** y quisieramos actualizar a una versión posterior **X.Y.Z** para la cual existan versiones anteriores que incluyan cambios listados en este documento, se deberá realizar la actualización pasando por todas estas versiones antes de poder llegar a la versión deseada.*

*EJEMPLO: Queremos actualizar desde la versión 1.0.0 a la 3.0.0 y existe un cambio en la base de datos en la actualización de la versión 1.0.0 a la 2.0.0.*

*Se deberá realizar primero la actualización de la versión 1.0.0 a la 2.0.0 y luego desde la 2.0.0 a la 3.0.0*

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
