-- --------------------------------------------------------------------------------------------------
-- EDATOS-3741 - [IESTADIS] Añadir y parametrizar un nuevo elemento para enlazar documentación de ayuda en el visualizador
-- --------------------------------------------------------------------------------------------------

-- Portal está preparado para que la propiedad esté a nulo, en cuyo caso simplemente no se mostrará el botón
insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.visualizer.help.url', null, true);
-- Ejemplo DEMO:        insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.visualizer.help.url', null, true);
-- Ejemplo IBESTAT:     insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.visualizer.help.url', null, true);
-- Ejemplo ISTAC:       insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.visualizer.help.url', null, true);
-- Ejemplo IESTADIS:    insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'metamac.portal.visualizer.help.url', null, true);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;