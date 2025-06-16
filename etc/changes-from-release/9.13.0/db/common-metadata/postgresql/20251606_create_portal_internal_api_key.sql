-- ---------------------------------------------------------------------------------------------------
-- EDATOS-4748 - Llamadas a apis internas desde la web con autenticación a través de API key
-- "metamac.portal.rest.api_key"
-- ---------------------------------------------------------------------------------------------------


insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.api_key',FILL_ME,false);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;

/* Key para todos los entornos
insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.api_key','5Vh1dt6oVJ8rTpv1XYrnxLafg3qMb5L1WfPSSfvXaYBDBsML9bv03tjSwiAGTN78',false);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;

*/
