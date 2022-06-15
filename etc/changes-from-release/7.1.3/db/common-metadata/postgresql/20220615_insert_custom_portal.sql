-- --------------------------------------------------------------------------------------------------
-- EDATOS-3215 - Refactorización del código para que la propiedad organización sea escalable
-- --------------------------------------------------------------------------------------------------

-- Añadir propiedad con la URL correspondiente al path al que luego se le concatenará /<nombreservicio>/header.html, /<nombreservicio>/styles.css y /<nombreservicio>/footer.html
-- Nótese que ha de existir una correspondencia entre servicio enlazado <> valor propiedad <> contenido de complementos apps
insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', null, true);
-- Ejemplo DEMO: insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', 'https://estadisticas.arte-consultores.com/apps/organisations/ibestat/portal', true);
-- Ejemplo PRE IBESTAT: insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', 'https://pre-ibestat.edatos.io/apps/organisations/ibestat/portal', true);
-- Ejemplo PRO IBESTAT: insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', 'https://ibestat.edatos.io/apps/organisations/ibestat/portal', true);
-- Ejemplo PRE ISTAC: insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', 'https://www3-pre.gobiernodecanarias.org/aplicaciones/appsistac/organisations/istac/portal', true);
-- Ejemplo PRO ISTAC: insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.custom.style.base.url', 'https://www3.gobiernodecanarias.org/aplicaciones/appsistac/organisations/istac/portal', true);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;