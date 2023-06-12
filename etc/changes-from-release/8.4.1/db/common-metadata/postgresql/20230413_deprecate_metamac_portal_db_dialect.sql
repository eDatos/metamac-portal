-- --------------------------------------------------------------------------------------------------
-- EDATOS-2234 - [CORE] Comprobar si se puede eliminar el dialecto de las propiedades de BBDD de todas las aplicaciones
-- 
-- Se depreca la propiedad con el valor metamac.portal.db.dialect
-- --------------------------------------------------------------------------------------------------

update tb_data_configurations set conf_key = 'deprecated.metamac.portal.db.dialect' where conf_key ='metamac.portal.db.dialect';
commit;
