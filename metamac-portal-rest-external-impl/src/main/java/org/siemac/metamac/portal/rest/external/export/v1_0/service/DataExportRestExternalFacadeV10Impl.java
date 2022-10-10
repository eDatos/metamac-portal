package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.addExtensionToFilenameIfNeeded;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.buildExportFilename;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.buildExportFilenameWithoutExtension;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.containsField;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.parseFieldsParameter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jackson.map.ObjectMapper;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.core.common.util.shared.UrnUtils;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConstants.ResourceType;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.exporters.SvgExportSupportedMimeType;
import org.siemac.metamac.portal.core.invocation.IndicatorsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.IndicatorsSystemsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.SrmRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.mapper.IndicatorsRestExternalMapper;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.external.export.v1_0.mapper.DatasetSelectionMapper;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
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
public class DataExportRestExternalFacadeV10Impl implements DataExportV1_0 {

    private static final String                    MEDIA_TYPE_APPLICATION_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @Autowired
    private ExportService                          exportService;

    @Autowired
    private PortalConfiguration                    portalConfiguration;

    @Autowired
    private StatisticalResourcesRestExternalFacade statisticalResourcesRestExternal;

    @Autowired
    private SrmRestExternalFacade                  srmRestExternal;

    @Autowired
    private IndicatorsRestExternalFacade           indicatorsRestExternal;

    @Autowired
    private IndicatorsSystemsRestExternalFacade    indicatorsSystemsRestExternal;

    @Autowired
    private JacksonJsonProvider                    jacksonJsonProvider;

    @Override
    public Response exportDatasetToTsv(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToTsv(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportDatasetToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportQueryToTsv(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        return exportQueryToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, lang, filename, fields);
    }

    @Override
    public Response exportQueryToTsv(String jsonBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportQueryToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, lang, filename, fields);
    }

    @Override
    public Response exportIndicatorToTsv(Exportation exportationBody, String resourceID, String filename, String fields) {
        return exportIndicatorToPlainText(PlainTextTypeEnum.TSV, exportationBody, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorToTsv(String jsonBody, String resourceID, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportIndicatorToPlainText(PlainTextTypeEnum.TSV, exportationBody, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorInstanceToTsv(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        return exportIndicatorInstanceToPlainText(PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorInstanceToTsv(String jsonBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportIndicatorInstanceToPlainText(PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename, fields);
    }

    @Override
    public Response exportIndicatorToPxForm(String jsonBody, String resourceID, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportIndicatorToPx(pxExportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToPx(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportIndicatorInstanceToPx(pxExportationBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportDatasetToCsvComma(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToCsvComma(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(Exportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            Exportation tsvExportation = objectMapper.readValue(jsonBody, Exportation.class);
            return exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, tsvExportation, agencyID, resourceID, version, lang, filename, fields);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToCsvSemicolon(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    @Override
    public Response exportDatasetToCsvSemicolon(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(Exportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            Exportation tsvExportation = objectMapper.readValue(jsonBody, Exportation.class);
            return exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, tsvExportation, agencyID, resourceID, version, lang, filename, fields);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToExcel(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".xlsx", exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(dataset, datasetSelection, lang, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportQueryToExcel(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".xlsx", exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
            }

            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);
            Dataset relatedDataset = retrieveDataset(query.getMetadata().getRelatedDataset().getUrn(), lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            return exportQueryToExcel(query, relatedDataset, datasetSelection, lang, filename);
        } catch (

        Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorToExcel(Exportation exportationBody, String resourceID, String filename) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".xlsx", exportationBody, ResourceType.INDICATOR.getName(), resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorInstanceToExcel(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".xlsx", exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportDatasetToExcel(Dataset dataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToExcel(SERVICE_CONTEXT, dataset, datasetSelection, lang, outputStream);

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    private Response exportQueryToExcel(Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportQueryToExcel(SERVICE_CONTEXT, query, relatedDataset, datasetSelection, lang, outputStream);

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    @Override
    public Response exportDatasetToExcelForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportDatasetToExcel(excelExportation, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToExcelForm(String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportQueryToExcel(excelExportation, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportIndicatorToExcelForm(String jsonBody, String resourceID, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportIndicatorToExcel(excelExportation, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToExcelForm(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportIndicatorInstanceToExcel(excelExportation, indicatorSystemCode, resourceID, filename);
    }

    private Exportation getExportation(String jsonBody) {
        try {
            ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(Exportation.class, MediaType.APPLICATION_JSON_TYPE);
            return objectMapper.readValue(jsonBody, Exportation.class);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToPx(Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {

            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".px", exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(dataset, datasetSelection, lang, filename);
        } catch (

        Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorToPx(Exportation exportationBody, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".px", exportationBody, ResourceType.INDICATOR.getName(), resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(dataset, datasetSelection, null, filename);
        } catch (

        Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorInstanceToPx(Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".px", exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(dataset, datasetSelection, null, filename);
        } catch (

        Exception e) {
            throw manageException(e);
        }
    }

    private Response exportDatasetToPx(Dataset dataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(SERVICE_CONTEXT, dataset, datasetSelection, lang, outputStream); // In PX file, all provided langs are sending

            return buildResponseOkWithFile(tmpFile, filename, MediaType.TEXT_PLAIN);
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    @Override
    public Response exportQueryToPx(Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            if (filename == null) {
                filename = buildExportFilename(".px", exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
            }

            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);
            Dataset relatedDataset = retrieveDataset(query.getMetadata().getRelatedDataset().getUrn(), lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            return exportQueryToPx(query, relatedDataset, datasetSelection, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportQueryToPx(Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String filename) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportQueryToPx(SERVICE_CONTEXT, query, relatedDataset, datasetSelection, null, outputStream); // In PX file, all provided langs are sending

            return buildResponseOkWithFile(tmpFile, filename, MediaType.TEXT_PLAIN);
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    @Override
    public Response exportDatasetToPxForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        Exportation pxExportation = getExportation(jsonBody);
        return exportDatasetToPx(pxExportation, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToPxForm(String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportQueryToPx(pxExportationBody, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportSvgToImage(String svg, String filename, Float width, String mimeType) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "image");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportSvgToImage(SERVICE_CONTEXT, svg, width, mimeType, outputStream);

            if (filename == null) {
                filename = "chart";
            }

            filename += SvgExportSupportedMimeType.getFileExtension(mimeType);

            return buildResponseOkWithFile(tmpFile, filename, mimeType);
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    @Override
    public Response exportSvgToImageForm(String svg, String filename, Float width, String mimeType) {
        return exportSvgToImage(svg, filename, width, mimeType);
    }

    private Response buildResponseOkWithFile(File file, String filename, String mimeType) throws FileNotFoundException {
        return Response.ok(new DeleteOnCloseFileInputStream(file), mimeType).header("Content-Disposition", "attachment; filename=" + filename).build();
    }

    private Dataset retrieveDataset(String agencyID, String resourceID, String version, String lang, String dimensionSelection) throws MetamacException {
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

    private Dataset retrieveDataset(String urn, String lang, String dimensionSelection) throws MetamacException {
        String[] urnSplited = UrnUtils.splitUrnStructure(urn);
        String agencyID = urnSplited[0];
        String resourceID = urnSplited[1];
        String version = urnSplited[2];
        return retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);
    }

    private Dataset retrieveDatasetFromIndicatorInstance(String indicatorSystemCode, String resourceID, String dimensionSelection) {
        String selectedRepresentations = IndicatorsRestExternalMapper.dimensionSelectionToSelectedRepresentations(dimensionSelection);
        DataType indicatorInstanceData = indicatorsSystemsRestExternal.retrieveIndicatorInstanceDataByCode(indicatorSystemCode, resourceID, selectedRepresentations);
        IndicatorInstanceType indicatorInstance = indicatorsSystemsRestExternal.retrieveIndicatorInstanceByCode(indicatorSystemCode, resourceID);
        IndicatorsSystemType indicatorSystem = indicatorsSystemsRestExternal.retrieveIndicatorsSystem(indicatorSystemCode);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorInstanceToDatasetMapper(indicatorInstance, indicatorInstanceData, organisation, indicatorSystem);
    }

    private Dataset retrieveDatasetFromIndicator(String resourceID, String dimensionSelection) {
        String selectedRepresentations = IndicatorsRestExternalMapper.dimensionSelectionToSelectedRepresentations(dimensionSelection);
        DataType indicatorData = indicatorsRestExternal.retrieveIndicatorData(resourceID, selectedRepresentations);
        IndicatorType indicator = indicatorsRestExternal.retrieveIndicator(resourceID);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorToDatasetMapper(indicator, indicatorData, organisation);
    }

    private Query retrieveQuery(String agencyID, String resourceID, String lang, String dimensionSelection) throws MetamacException {
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

    private File generatePlainTextZip(PlainTextTypeEnum plainTextTypeEnum, File fileObservations, File fileAttributes, String filenamePrefix) throws Exception {
        File zipFile = File.createTempFile("metamac", "zip");
        try (ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));) {

            addToZip(out, fileObservations, filenamePrefix + "-observations." + plainTextTypeEnum.getExtension());
            addToZip(out, fileAttributes, filenamePrefix + "-attributes." + plainTextTypeEnum.getExtension());

            return zipFile;
        }
    }

    private void addToZip(ZipOutputStream zip, File fileToZip, String filenameToZip) throws Exception {
        try (InputStream in = new FileInputStream(fileToZip)) {

            zip.putNextEntry(new ZipEntry(filenameToZip));

            // Transfer bytes from the file to the ZIP file
            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                zip.write(buf, 0, len);
            }

            // Complete the entry
            zip.closeEntry();
        }
    }

    private Response exportIndicatorToPlainText(PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String resourceID, String filename, String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForIndicator(exportationBody, resourceID);

        if (filename == null) {
            filename = buildExportFilenameWithoutExtension(exportationBody, ResourceType.INDICATOR.getName(), resourceID);
        }

        return exportResourceAccessToPlainText(resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportIndicatorInstanceToPlainText(PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename,
            String fields) {
        ResourceAccess resourceAccess = buildResourceAccessForIndicatorInstance(exportationBody, indicatorSystemCode, resourceID);

        if (filename == null) {
            filename = buildExportFilenameWithoutExtension(exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), resourceID);
        }

        return exportResourceAccessToPlainText(resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportDatasetToPlainText(PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename,
            String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForDataset(exportationBody, agencyID, resourceID, version, lang);

        if (filename == null) {
            filename = buildExportFilenameWithoutExtension(exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
        }

        return exportResourceAccessToPlainText(resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportQueryToPlainText(PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String agencyID, String resourceID, String lang, String filename, String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForQuery(exportationBody, agencyID, resourceID, lang);

        if (filename == null) {
            filename = buildExportFilenameWithoutExtension(exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
        }

        return exportResourceAccessToPlainText(resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportResourceAccessToPlainText(ResourceAccess resourceAccess, String proposedFilename, PlainTextTypeEnum plainTextTypeEnum, String fields) {

        FileOutputStream outputStreamObservations = null;
        FileOutputStream outputStreamAttributes = null;
        try {
            final File tmpFileObservations = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            outputStreamObservations = new FileOutputStream(tmpFileObservations);

            Set<String> parsedFields = parseFieldsParameter(fields);

            boolean excludeAttributes = containsField(parsedFields, RestExternalConstants.FIELD_EXCLUDE_ATTRIBUTES);
            if (excludeAttributes) {
                // Not zip
                exportService.exportResourceToPlainTextWithoutAttributes(SERVICE_CONTEXT, PlainTextTypeEnum.TSV, resourceAccess, outputStreamObservations);

                String filename = addExtensionToFilenameIfNeeded(plainTextTypeEnum.getExtension(), proposedFilename + "-observations");
                return buildResponseOkWithFile(tmpFileObservations, filename, plainTextTypeEnum.getMimeType());
            } else {
                // Zip
                final File tmpFileAttributes = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
                outputStreamAttributes = new FileOutputStream(tmpFileAttributes);
                exportService.exportResourceToPlainText(SERVICE_CONTEXT, PlainTextTypeEnum.TSV, resourceAccess, outputStreamObservations, outputStreamAttributes);

                String filename = addExtensionToFilenameIfNeeded("zip", proposedFilename);
                String filenamePrefix = FilenameUtils.getBaseName(filename);
                File zipFile = generatePlainTextZip(plainTextTypeEnum, tmpFileObservations, tmpFileAttributes, filenamePrefix);
                return buildResponseOkWithFile(zipFile, filename, "application/octet-stream");
            }
        } catch (Exception e) {
            throw manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStreamObservations);
            IOUtils.closeQuietly(outputStreamAttributes);
        }

    }

    private ResourceAccess buildResourceAccessForDataset(Exportation exportationBody, String agencyID, String resourceID, String version, String lang) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            if (lang == null) {
                lang = langDefault;
            }
            return new ResourceAccess(srmRestExternal, dataset, datasetSelection, lang, langDefault);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForQuery(Exportation exportationBody, String agencyID, String resourceID, String lang) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            // Retrieve dataset
            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            if (lang == null) {
                lang = langDefault;
            }
            return new ResourceAccess(srmRestExternal, query, null, datasetSelection, lang, langDefault);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForIndicator(Exportation exportationBody, String resourceID) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return new ResourceAccess(srmRestExternal, dataset, datasetSelection);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForIndicatorInstance(Exportation exportationBody, String indicatorSystemCode, String resourceID) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return new ResourceAccess(srmRestExternal, dataset, datasetSelection);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

}