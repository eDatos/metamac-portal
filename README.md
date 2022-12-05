# Desarrollo

## Parámetro _theme_
Se puede usar un parámetro _theme_ para testear las cabeceras y pies cargados en complementos-apps sin necesidad de tener que usar las propiedades configuradas.

Ejemplo de petición:
* http://localhost:8080/statistical-visualizer-8.2.3-SNAPSHOT/visualizer/custom/data.html?theme=istac/default&agencyId=ISTAC&resourceId=C00031A_000002&version=~latest&resourceType=dataset#visualization/table

Ejemplos de valores para el parámetro _theme_ :
* istac/agriculture
* istac/default
* istac/environment
* ibestat/iqua
* iecm/default