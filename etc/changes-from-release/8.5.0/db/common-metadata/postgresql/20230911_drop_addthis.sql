-- --------------------------------------------------------------------------------------------------
-- EDATOS-4120 - No se muestra la URL para compartir un dataset
-- Eliminar la propiedad sin uso
-- --------------------------------------------------------------------------------------------------

delete from tb_data_configurations where conf_key = 'metamac.analytics.addthis.code';

commit;
