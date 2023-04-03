-- --------------------------------------------------------------------------------------------------
-- EDATOS-3807 - Modificar el diseño del visualizador para tenga el mismo aspecto que las otras aplicaciones externas de edatos
-- --------------------------------------------------------------------------------------------------

UPDATE tb_data_configurations SET conf_value = 'FILL_ME' WHERE conf_key = 'metamac.portal.default.style.css.url';
UPDATE tb_data_configurations SET conf_value = 'FILL_ME' WHERE conf_key = 'metamac.portal.default.style.header.url';
UPDATE tb_data_configurations SET conf_value = 'FILL_ME' WHERE conf_key = 'metamac.portal.default.style.footer.url';

-- Ejemplo para todos los entornos donde se despliegue la funcionalidad:
-- UPDATE tb_data_configurations SET conf_value = null WHERE conf_key = 'metamac.portal.default.style.css.url';
-- UPDATE tb_data_configurations SET conf_value = (select conf_value from tb_data_configurations where conf_key = 'metamac.app.style.header.url') WHERE conf_key = 'metamac.portal.default.style.header.url';
-- UPDATE tb_data_configurations SET conf_value = (select conf_value from tb_data_configurations where conf_key = 'metamac.app.style.footer.url') WHERE conf_key = 'metamac.portal.default.style.footer.url';

commit;