-- --------------------------------------------------------------------------------------------------
-- [EDATOS-3827] - Realizar la migración de permalinks para adaptarse a los cambios de esta tarea. Se migrarán los códigos geográficos del permalinks a sus elementos de variable asociadas.
-- ATENCIÓN!! Esta migración debe se posterior a la migración de la base de datos de indicadores e indicadores_data que se detalla en el módulo de indicadores.
-- --------------------------------------------------------------------------------------------------


-- PRECONDICIÓN. ATENCIÓN!! La migración del módulo de indicadores y sus datos se debe realizar primero que ésta.

--1) Asegurarse que la tabla "temp_mig_codes_with_var_element" se ha creado en esta base de datos así como los datos asociados. Esta tabla se ha tenido que crear y migrar a este módulo en la migración del módulo de indicadores.

--2) Ejecutar el script  "20240426_1_create_table_temp_mig_permalinks.sql" para crear la tabla temporal de migración de permalinks asociados a indicadores

--3) Obtener los permalinks asociados a indicadores ejecutando el siguiente insert
insert into  temp_mig_permalinks(id, code, oldContent) select id, code, "content" from tb_permalinks tp where content like '%"type":"indicator"%';

--4) Ejecutar el script "20240426_2_create_mig_functions.sql" para crear las funciones necesarias para el tratamiento del "json" asociado a permalinks.

--5) Ejecutar el script contenido en el fichero  "20240426_3_create_main_mig_script.sql" que generará un nuevo json en la columna "newContent" de la tabla "temp_mig_permalinks" con los cambios en el metadato de valores geográficos sustituyendo códigos geográficos por elementos de variable. 

--6) Consultar la tabla "temp_mig_permalinks" y asegurarse de que ningún elemento en el campo "newContent" ha quedado a nulo. En la salida puede que haya algún mensaje indicando que algún permalink no se ha migrado porque no contiene valores geográficos. Eso es algo normal. Asegurarse al menos con uno que es correcto y que no tiene valores geográficos en el metadato "GEOGRAPHICAL

/* Ejemplo de salida sin valores geográficos
{"queryParams":{"agency":"","identifier":"PUESTOS_TOTALES_ISTAC","version":"","type":"indicator","indicatorSystem":"","geo":"","visualizationType":"table","fullScreen":false},"hash":"#visualization/table","selection":{"TIME":{"position":0,"selectedCategories":["2016","2015","2014","2013","2012","2011","2010"]},"MEASURE":{"position":21,"selectedCategories":["ABSOLUTE","ANNUAL_PERCENTAGE_RATE","ANNUAL_PUNTUAL_RATE"]},"GEOGRAPHICAL":{"position":20,"selectedCategories":[]}}}

donde se ve que no hay valores:
"GEOGRAPHICAL":{"position":20,"selectedCategories":[]}
*/

--7) Sustituir en la tabla tb_permalinks el valor del campo  "content" por el nuevo json para los permalinks asociados a indicadores.
update  tb_permalinks p 
set "content" = newContent
from temp_mig_permalinks tempP
where tempP.code = p.code;


--8) Borrar los elementos de migración. La tabla "temp_mig_permalinks" se dejará un tiempo ya que contiene el json original y servirá como copia de seguridad. 
--La tarea asociada a la tarea donde se borrarán todos los elementos de migración en release posterior es EDATOS-4345
drop function json_object_set_path;
drop function json_object_update_key;
drop function temp_convert_geographical_codes_not_filter_dimension;
drop function temp_convert_geographical_codes_filter_dimension;
drop table temp_mig_codes_with_var_element;