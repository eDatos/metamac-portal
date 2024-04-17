-- --------------------------------------------------------------------------------------------------
-- [EDATOS-3834] - Permitir disponer de las funcionalidades de exportación y permalinks de manera interna
-- --------------------------------------------------------------------------------------------------
insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','http://FILL_ME_WITH_HOST_AND_PORT/FILL_ME_WITH_METAMAC_PORTAL_INTERNAL_APP/apis',false);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';
-- LOCAL
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','http://localhost:8080/statistical-visualizer-internal/apis',false);
-- DESARROLLO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://estadisticas.arte-consultores.com/statistical-visualizer-internal/apis',false);
-- DEMO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://demo.edatos.io/statistical-visualizer-internal/apis',false);
-- ISTAC PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://www3-pre.gobiernodecanarias.net/aplicaciones/statistical-visualizer-internal-istac/apis',false);
-- ISTAC PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://www3.gobiernodecanarias.net/aplicaciones/statistical-visualizer-internal-istac/apis',false);
-- IBESTAT PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://pre.ibestat.cat/private/apps/statistical-visualizer-internal/apis',false);
-- IBESTAT PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://ibestat.cat/private/apps/statistical-visualizer-internal/apis',false);
-- IESTADIS PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://pre-iestadis.edatos.io/statistical-visualizer-internal/apis',false);
-- IESTADIS PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal','https://iestadis.edatos.io/statistical-visualizer-internal/apis',false);


insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','http://FILL_ME_WITH_HOST_AND_PORT/FILL_ME_WITH_METAMAC_PORTAL_INTERNAL_APP/apis/export',false);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';
-- LOCAL
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','http://localhost:8080/statistical-visualizer-internal-api/apis/export',false);
-- DESARROLLO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://estadisticas.arte-consultores.com/statistical-visualizer-internal-api/apis/export',false);
-- DEMO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://demo.edatos.io/statistical-visualizer-internal-api/apis/export',false);
-- ISTAC PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://www3-pre.gobiernodecanarias.net/aplicaciones/appsinternalistac/statistical-visualizer-internal-api-istac/apis/export',false);
-- ISTAC PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://www3.gobiernodecanarias.net/aplicaciones/appsinternalistac/statistical-visualizer-internal-api-istac/apis/export',false);
-- IBESTAT PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://pre.ibestat.cat/private/apis/statistical-visualizer-internal-api/apis/export',false);
-- IBESTAT PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://ibestat.cat/private/apis/statistical-visualizer-internal-api/apis/export',false);
-- IESTADIS PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://pre-iestadis.edatos.io/statistical-visualizer-internal-api/apis/export',false);
-- IESTADIS PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.export','https://iestadis.edatos.io/statistical-visualizer-internal-api/apis/export',false);


insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'http://FILL_ME_WITH_HOST_AND_PORT/FILL_ME_WITH_METAMAC_PORTAL_INTERNAL_APP/apis/permalinks',false);
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';
-- LOCAL
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'http://localhost:8080/statistical-visualizer-internal-api/apis/permalinks',false);
-- DESARROLLO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://estadisticas.arte-consultores.com/statistical-visualizer-internal-api/apis/permalinks',false);
-- DEMO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://demo.edatos.io/statistical-visualizer-internal-api/apis/permalinks',false);
-- ISTAC PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://www3-pre.gobiernodecanarias.net/aplicaciones/appsinternalistac/statistical-visualizer-internal-api-istac/apis/permalinks',false);
-- ISTAC PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://www3.gobiernodecanarias.net/aplicaciones/appsinternalistac/statistical-visualizer-internal-api-istac/apis/permalinks',false);
-- IBESTAT PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://pre.ibestat.cat/private/apis/statistical-visualizer-internal-api/apis/permalinks',false);
-- IBESTAT PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://ibestat.cat/private/apis/statistical-visualizer-internal-api/apis/permalinks',false);
-- IESTADIS PRE
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://pre-iestadis.edatos.io/statistical-visualizer-internal-api/apis/permalinks',false);
-- IESTADIS PRO
-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE,EXTERNALLY_PUBLISHED) values(GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,true,'metamac.portal.rest.internal.permalinks', 'https://iestadis.edatos.io/statistical-visualizer-internal-api/apis/permalinks',false);


commit;
