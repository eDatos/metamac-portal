-- --------------------------------------------------------------------------------------------------
-- [EDATOS-3827] - Realizar la migración de permalinks para adaptarse a los cambios de esta tarea. Se migrarán los códigos geográficos del permalinks a sus elementos de variable asociadas.
-- Crear tabla temporal para migración de permalinks
-- --------------------------------------------------------------------------------------------------


create table temp_mig_permalinks
(
	id int8 NOT NULL,
	code varchar(255) NOT NULL,
	oldContent text NOT NULL,
	newContent text
);

commit;