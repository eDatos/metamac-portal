-- --------------------------------------------------------------------------------------------------
-- EDATOS-4793 - Adaptar diseño de interfaz de usuarios al sistema de diseño del Instituto. Explorador de datos estadísticos
-- --------------------------------------------------------------------------------------------------

-- Establece la misma url para el header de portal que la que se tiene para el resto de aplicaciones.
UPDATE tb_data_configurations
SET conf_value = (SELECT conf_value FROM tb_data_configurations WHERE conf_key = 'metamac.app.style.header.url')
WHERE conf_key = 'metamac.portal.default.style.header.url';

-- Establece la misma url para el footer de portal que la que se tiene para el resto de aplicaciones.
UPDATE tb_data_configurations
SET conf_value = (SELECT conf_value FROM tb_data_configurations WHERE conf_key = 'metamac.app.style.footer.url')
WHERE conf_key = 'metamac.portal.default.style.footer.url';

UPDATE tb_data_configurations 
SET conf_value = '' 
WHERE conf_key = 'metamac.portal.default.style.css.url';

commit;
