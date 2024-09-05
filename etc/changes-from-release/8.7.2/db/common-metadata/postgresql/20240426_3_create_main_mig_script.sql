-- --------------------------------------------------------------------------------------------------
-- [EDATOS-3827] - Realizar la migración de permalinks para adaptarse a los cambios de esta tarea. Se migrarán los códigos geográficos del permalinks a sus elementos de variable asociadas.
-- Script que realiza la migración del json original con códigos geográficos y genera un nuevo json con los elementos de variable correspondientes
-- --------------------------------------------------------------------------------------------------

----------------------------------
-- Main script that execute all  the geographical codes migration to variable elements
----------------------------------

do
$$
declare
rec record;
recSelected record;
selection json;
geo json;
newContentWithVariableElements json;
existsGeoDimension bool;
begin
-- select 
	for rec in
	 SELECT code, oldContent 
      FROM   temp_mig_permalinks  
     loop
      
	existsGeoDimension = true;     
	     
	SELECT value into selection FROM 
json_each( rec.oldContent::json) where "key" = 'selection';    
 
    select value into geo from json_each((
SELECT value FROM 
json_each(rec.oldContent::json) where "key" = 'selection'))
where "key" = 'GEOGRAPHICAL';

if (SELECT count(*) FROM 
json_each(geo) where "key" = 'selectedCategories') = 0  then
if (SELECT count(*) FROM 
json_each(geo) where "key" = 'categories') = 0  then
 raise notice 'no se han encontrado valores geográficos para el permalink %', rec.code;   
existsGeoDimension = false;
 else
selection = temp_convert_geographical_codes_filter_dimension(geo, selection, rec.code);
  newContentWithVariableElements = json_object_set_path(rec.oldContent::json, '{"selection"}', selection);
 end if;
else
selection = temp_convert_geographical_codes_not_filter_dimension(geo, selection, rec.code);
newContentWithVariableElements = json_object_set_path(rec.oldContent::json, '{"selection"}', selection);

end if;

if (existsGeoDimension) then
  update temp_mig_permalinks set newcontent = newContentWithVariableElements where code = rec.Code;
end if;

end loop;
end;
$$
language plpgsql;