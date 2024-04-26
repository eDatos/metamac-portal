-- --------------------------------------------------------------------------------------------------
-- [EDATOS-3827] - Realizar la migración de permalinks para adaptarse a los cambios de esta tarea. Se migrarán los códigos geográficos del permalinks a sus elementos de variable asociadas.
-- Crear funciones de apoyo a la migración
-- --------------------------------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION json_object_set_path(json json, key_path text[], value_to_set json)
 RETURNS json
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT CASE COALESCE(array_length("key_path", 1), 0)
         WHEN 0 THEN to_json("value_to_set")
         WHEN 1 then "json_object_update_key"("json", "key_path"[l], "value_to_set") -- '{"g":1}'::json --
         ELSE "json_object_update_key"(
           "json",
           "key_path"[l],
           "json_object_set_path"(
             COALESCE(NULLIF(("json" -> "key_path"[l])::text, 'null'), '{}')::json,
             "key_path"[l+1:u],
             "value_to_set"
           )
         )
       END
  FROM array_lower("key_path", 1) l,
       array_upper("key_path", 1) u
$function$;


CREATE OR REPLACE FUNCTION "json_object_update_key"(
  "json"          json,
  "key_to_set"    TEXT,
  "value_to_set"  json
)
  RETURNS json
  LANGUAGE sql
  IMMUTABLE
  STRICT
AS $function$
SELECT CASE
  WHEN ("json" -> "key_to_set") IS NULL THEN '1'::json--"json"
  ELSE (SELECT concat('{', string_agg(to_json("key") || ':' || "value", ','), '}')
          FROM (SELECT *
                  FROM json_each("json")
                 WHERE "key" <> "key_to_set"
                 UNION ALL
                SELECT "key_to_set", to_json("value_to_set")) AS "fields")::json
END
$function$;


----------------------------------
-- function to migrate geographical codes to variable elements when the geopgrahical dimension is not the filter dimension in the visualizer.
----------------------------------

CREATE OR REPLACE FUNCTION temp_convert_geographical_codes_not_filter_dimension(geo json, selection json, codePermalink text)
 RETURNS json
 LANGUAGE plpgsql
AS $$
declare
recSelected record;
selectedCategoriesTarget TEXT[];
 geoCode text;
 i int;
variableElementCode varchar(255);
begin
  i = 0;
    for recSelected in (select json_array_elements(geo->'selectedCategories') element)
    loop
	    geoCode = replace(recSelected.element::text, '"','');
	
	    select variable_element_code into variableElementCode  from temp_mig_codes_with_var_element tm where tm.code = geoCode limit 1;   
	   
	   	if variableElementCode is null then
		raise notice 'el código % no tiene conversión a elemento de variable. permalink code: %', geoCode, codePermalink;
		end if;
	   
	   selectedCategoriesTarget[i] = variableElementCode;
	   i = i + 1;

    end loop;
     	
      if (array_length(selectedCategoriesTarget, 1) is NULL) then
        raise notice 'No se han encontrado valores geográficos para el permalink % por lo que se deja como está.', codePermalink;
      else
        geo = json_object_set_path(geo, '{"selectedCategories"}', array_to_json(selectedCategoriesTarget)); 
      end if;
 
return json_object_set_path(selection, '{"GEOGRAPHICAL"}', geo);

end;	
$$;

----------------------------------
-- function to migrate geographical codes to variable elements when the geopgrahical dimension is the filter dimension in the visualizer.
-- each entry is like this: {"id":"ES61","selected":true,"drawable":true} --> the id element must be change by the variable element.
----------------------------------

CREATE OR REPLACE FUNCTION temp_convert_geographical_codes_filter_dimension(geo json, selection json, codePermalink text)
 RETURNS json
 LANGUAGE plpgsql
AS $$
declare
recSelected record;
selectedCategoriesTarget text[];
selectedCategoriesTarget2 text[];
geoCodeRecord json;
geoCode text;
i int;
variableElementCode varchar(255);
arr json[];
begin
  i = 0;

    for recSelected in (select json_array_elements(geo->'categories') element)
    loop
	   geoCodeRecord = recSelected.element::json;
	  	
	    SELECT value into geoCode FROM 
		json_each(geoCodeRecord) where "key" = 'id';
		
	    geoCode = replace(geoCode::text, '"','');
	
	    select variable_element_code into variableElementCode  from temp_mig_codes_with_var_element tm where tm.code = geoCode limit 1;   
	   
	   	if variableElementCode is null then
		raise notice 'el código % no tiene conversión a elemento de variable. permalink code: %', geoCode, codePermalink;
		end if;
	   geoCodeRecord = json_object_set_path(geoCodeRecord, '{"id"}', to_json(variableElementCode));
	  arr[i] = geoCodeRecord;
	   i = i + 1;

    end loop;
   
   if (array_length(arr, 1) is NULL) then
     raise notice 'No se han encontrado valores geográficos para el permalink % por lo que se deja como está.', codePermalink;
   else
     geo = json_object_set_path(geo, '{"categories"}'::text[], to_json(arr)); 
   end if;
     
   return json_object_set_path(selection, '{"GEOGRAPHICAL"}'::text[], geo);
  
end;	
$$;
