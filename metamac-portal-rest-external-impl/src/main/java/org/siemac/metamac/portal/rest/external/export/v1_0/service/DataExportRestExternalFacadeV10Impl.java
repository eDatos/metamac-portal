package org.siemac.metamac.portal.rest.external.export.v1_0.service;


import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.Response;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.invocation.external.IndicatorsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.external.IndicatorsSystemsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.external.SrmRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.external.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.external.mapper.IndicatorsRestExternalMapper;
import org.siemac.metamac.portal.rest.common.export.v1_0.DataExportRestCommon;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Agency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

@Service("dataExportRestExternalFacadeV10")
public class DataExportRestExternalFacadeV10Impl extends DataExportRestCommon implements DataExportV1_0 {


    @Autowired
    private StatisticalResourcesRestExternalFacade statisticalResourcesRestExternal;

    @Autowired
    private IndicatorsRestExternalFacade           indicatorsRestExternal;

    @Autowired
    private SrmRestExternalFacade                  srmRestExternal;

    @Autowired
    private IndicatorsSystemsRestExternalFacade    indicatorsSystemsRestExternal;


    @Override
    public Response exportDatasetToTsv(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToTsv(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToTsv(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToTsv(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportQueryToTsv(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        return exportQueryToTsv(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, lang, filename, fields);
    }

    @Override
    public Response exportQueryToTsv(String jsonBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        return exportQueryToTsv(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, lang, filename, fields);
    }

    @Override
    public Response exportIndicatorToTsv(Exportation exportationBody, String resourceID, String filename, String fields) {
        return exportIndicatorToTsv(SERVICE_CONTEXT, exportationBody, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorToTsv(String jsonBody, String resourceID, String filename, String fields) {
        return exportIndicatorToTsv(SERVICE_CONTEXT, jsonBody, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorInstanceToTsv(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        return exportIndicatorInstanceToTsv(SERVICE_CONTEXT, exportationBody, indicatorSystemCode, resourceID, filename, fields) ;
    }

    @Override
    public Response exportIndicatorInstanceToTsv(String jsonBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        return exportIndicatorInstanceToTsv(SERVICE_CONTEXT, jsonBody, indicatorSystemCode, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorToPxForm(String jsonBody, String resourceID, String filename) {
        return exportIndicatorToPxForm(SERVICE_CONTEXT, jsonBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToPx(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        return exportIndicatorInstanceToPx(SERVICE_CONTEXT, jsonBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportDatasetToCsvComma(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToCsvComma(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToCsvComma(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToCsvComma(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToCsvSemicolon(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToCsvSemicolon(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToCsvSemicolon(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToCsvSemicolon(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToExcel(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToExcel(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToExcel(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        return exportQueryToExcel(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportIndicatorToExcel(Exportation exportationBody, String resourceID, String filename) {
        return exportIndicatorToExcel(SERVICE_CONTEXT, exportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToExcel(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        return exportIndicatorInstanceToExcel(SERVICE_CONTEXT, exportationBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportDatasetToExcelForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToExcelForm(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToExcelForm(String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        return exportQueryToExcelForm(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportIndicatorToExcelForm(String jsonBody, String resourceID, String filename) {
        return exportIndicatorToExcelForm(SERVICE_CONTEXT, jsonBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToExcelForm(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        return exportIndicatorInstanceToExcelForm(SERVICE_CONTEXT, jsonBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportDatasetToPx(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
       return exportDatasetToPx(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportIndicatorToPx(Exportation exportationBody, String resourceID, String filename) {
        return exportIndicatorToPx(SERVICE_CONTEXT, exportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToPx(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        return exportIndicatorInstanceToPx(SERVICE_CONTEXT, exportationBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportQueryToPx(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        return exportQueryToPx(SERVICE_CONTEXT, exportationBody, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportDatasetToPxForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPxForm(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToPxForm(String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        return exportQueryToPxForm(SERVICE_CONTEXT, jsonBody, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportSvgToImage(String svg, String filename, Float width, String mimeType) {
        return exportSvgToImage(SERVICE_CONTEXT, svg, filename, width, mimeType);
    }

    @Override
    public Response exportSvgToImageForm(String svg, String filename, Float width, String mimeType) {
        return exportSvgToImageForm(SERVICE_CONTEXT, svg, filename, width, mimeType);
    }

    @Override
    public Dataset retrieveDataset(String agencyID, String resourceID, String version, String lang, String dimensionSelection) throws MetamacException {
        List<String> langs = new ArrayList<String>();
        String langAlternative = portalConfiguration.retrieveLanguageDefault();
        if (lang != null) {
            langs.add(lang);
        }
        if (!langAlternative.equals(lang)) {
            langs.add(langAlternative);
        }
        return statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, langs, null, dimensionSelection);
    }

    @Override
    public Dataset retrieveDatasetFromIndicatorInstance(String indicatorSystemCode, String resourceID, String dimensionSelection) {
        DataType indicatorInstanceData = indicatorsSystemsRestExternal.retrieveIndicatorInstanceDataByCode(indicatorSystemCode, resourceID, dimensionSelection);
        IndicatorInstanceType indicatorInstance = indicatorsSystemsRestExternal.retrieveIndicatorInstanceByCode(indicatorSystemCode, resourceID);
        IndicatorsSystemType indicatorSystem = indicatorsSystemsRestExternal.retrieveIndicatorsSystem(indicatorSystemCode);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorInstanceToDatasetMapper(indicatorInstance, indicatorInstanceData, organisation, indicatorSystem);
    }

    @Override
    public Dataset retrieveDatasetFromIndicator(String resourceID, String dimensionSelection) {
        DataType indicatorData = indicatorsRestExternal.retrieveIndicatorData(resourceID, dimensionSelection);
        IndicatorType indicator = indicatorsRestExternal.retrieveIndicator(resourceID);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorToDatasetMapper(indicator, indicatorData, organisation);
    }

    @Override
    public Query retrieveQuery(String agencyID, String resourceID, String lang, String dimensionSelection) throws MetamacException {
        List<String> langs = new ArrayList<String>();
        String langAlternative = portalConfiguration.retrieveLanguageDefault();
        if (lang != null) {
            langs.add(lang);
        }
        if (!langAlternative.equals(lang)) {
            langs.add(langAlternative);
        }
        return statisticalResourcesRestExternal.retrieveQuery(agencyID, resourceID, langs, null, dimensionSelection);
    }
}