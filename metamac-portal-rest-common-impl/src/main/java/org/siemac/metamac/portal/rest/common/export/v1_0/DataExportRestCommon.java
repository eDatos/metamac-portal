package org.siemac.metamac.portal.rest.common.export.v1_0;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jackson.map.ObjectMapper;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.core.common.util.shared.UrnUtils;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConstants.ResourceType;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.exporters.SvgExportSupportedMimeType;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.portal.rest.common.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.common.export.v1_0.mapper.DatasetSelectionMapper;
import org.siemac.metamac.portal.rest.common.service.utils.ExportUtils;
import org.siemac.metamac.portal.rest.common.service.utils.PortalRestUtils;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.springframework.beans.factory.annotation.Autowired;


public abstract class DataExportRestCommon {

    private static final String                    MEDIA_TYPE_APPLICATION_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @Autowired
    private ExportService                          exportService;

    @Autowired
    protected PortalConfiguration                    portalConfiguration;

    @Autowired
    private JacksonJsonProvider                    jacksonJsonProvider;


    protected abstract Dataset retrieveDataset(String agencyID, String resourceID, String version, String lang, String dimensionSelection) throws MetamacException;
    protected abstract Dataset retrieveDatasetFromIndicatorInstance(String indicatorSystemCode, String resourceID, String dimensionSelection);
    protected abstract Dataset retrieveDatasetFromIndicator(String resourceID, String dimensionSelection);
    protected abstract Query retrieveQuery(String agencyID, String resourceID, String lang, String dimensionSelection) throws MetamacException;


    public Response exportDatasetToTsv(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportDatasetToTsv(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportQueryToTsv(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        return exportQueryToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, lang, filename, fields);
    }

    public Response exportQueryToTsv(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String lang, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportQueryToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, lang, filename, fields);
    }

    public Response exportIndicatorToTsv(ServiceContext ctx, Exportation exportationBody, String resourceID, String filename, String fields) {
        return exportIndicatorToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, resourceID, filename, fields);
    }

    public Response exportIndicatorToTsv(ServiceContext ctx, String jsonBody, String resourceID, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportIndicatorToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, resourceID, filename, fields);
    }

    public Response exportIndicatorInstanceToTsv(ServiceContext ctx, Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        return exportIndicatorInstanceToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename, fields);
    }

    public Response exportIndicatorInstanceToTsv(ServiceContext ctx, String jsonBody, String indicatorSystemCode, String resourceID, String filename, String fields) {
        Exportation exportationBody = getExportation(jsonBody);
        return exportIndicatorInstanceToPlainText(ctx, PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename, fields);
    }

    public Response exportIndicatorToPxForm(ServiceContext ctx, String jsonBody, String resourceID, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportIndicatorToPx(ctx, pxExportationBody, resourceID, filename);
    }

    public Response exportIndicatorInstanceToPx(ServiceContext ctx, String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportIndicatorInstanceToPx(ctx, pxExportationBody, indicatorSystemCode, resourceID, filename);
    }

    public Response exportDatasetToCsvComma(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.CSV_COMMA, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportDatasetToCsvComma(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        Exportation tsvExportation = getExportation(jsonBody);
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.CSV_COMMA, tsvExportation, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportDatasetToCsvSemicolon(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.CSV_SEMICOLON, exportationBody, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportDatasetToCsvSemicolon(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String version, String lang, String filename, String fields) {
        Exportation tsvExportation = getExportation(jsonBody);
        return exportDatasetToPlainText(ctx, PlainTextTypeEnum.CSV_SEMICOLON, tsvExportation, agencyID, resourceID, version, lang, filename, fields);
    }

    public Response exportDatasetToExcel(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".xlsx", exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(ctx, dataset, datasetSelection, lang, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    public Response exportQueryToExcel(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".xlsx", exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
            }

            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);
            Dataset relatedDataset = retrieveDataset(query.getMetadata().getRelatedDataset().getUrn(), lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            return exportQueryToExcel(ctx, query, relatedDataset, datasetSelection, lang, filename);
        } catch (

        Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    public Response exportIndicatorToExcel(ServiceContext ctx, Exportation exportationBody, String resourceID, String filename) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".xlsx", exportationBody, ResourceType.INDICATOR.getName(), resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(ctx, dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    public Response exportIndicatorInstanceToExcel(ServiceContext ctx, Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".xlsx", exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToExcel(ctx, dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private Response exportDatasetToExcel(ServiceContext ctx, Dataset dataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, lang, outputStream);

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }

    private Response exportQueryToExcel(ServiceContext serviceContext, Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportQueryToExcel(serviceContext, query, relatedDataset, datasetSelection, lang, outputStream);

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }


    public Response exportDatasetToExcelForm(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportDatasetToExcel(ctx, excelExportation, agencyID, resourceID, version, lang, filename);
    }


    public Response exportQueryToExcelForm(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportQueryToExcel(ctx, excelExportation, agencyID, resourceID, lang, filename);
    }


    public Response exportIndicatorToExcelForm(ServiceContext ctx, String jsonBody, String resourceID, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportIndicatorToExcel(ctx, excelExportation, resourceID, filename);
    }


    public Response exportIndicatorInstanceToExcelForm(ServiceContext ctx, String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        Exportation excelExportation = getExportation(jsonBody);
        return exportIndicatorInstanceToExcel(ctx, excelExportation, indicatorSystemCode, resourceID, filename);
    }

    private Exportation getExportation(String jsonBody) {
        if (StringUtils.isEmpty(jsonBody)) {
            return null;
        }
        try {
            ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(Exportation.class, MediaType.APPLICATION_JSON_TYPE);
            return objectMapper.readValue(jsonBody, Exportation.class);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestCommonConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }


    public Response exportDatasetToPx(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {

            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".px", exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(ctx, dataset, datasetSelection, lang, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }


    public Response exportIndicatorToPx(ServiceContext ctx, Exportation exportationBody, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".px", exportationBody, ResourceType.INDICATOR.getName(), resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(ctx, dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }


    public Response exportIndicatorInstanceToPx(ServiceContext ctx, Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".px", exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }

            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            return exportDatasetToPx(ctx, dataset, datasetSelection, null, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private Response exportDatasetToPx(ServiceContext ctx, Dataset dataset, DatasetSelection datasetSelection, String lang, String filename) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(ctx, dataset, datasetSelection, lang, outputStream); // In PX file, all provided langs are sending

            return buildResponseOkWithFile(tmpFile, filename, MediaType.TEXT_PLAIN);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }


    public Response exportQueryToPx(ServiceContext ctx, Exportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            if (filename == null) {
                filename = ExportUtils.buildExportFilename(".px", exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
            }

            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);
            Dataset relatedDataset = retrieveDataset(query.getMetadata().getRelatedDataset().getUrn(), lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            return exportQueryToPx(ctx, query, relatedDataset, datasetSelection, filename);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private Response exportQueryToPx(ServiceContext ctx, Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String filename) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportQueryToPx(ctx, query, relatedDataset, datasetSelection, null, outputStream); // In PX file, all provided langs are sending

            return buildResponseOkWithFile(tmpFile, filename, MediaType.TEXT_PLAIN);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }


    public Response exportDatasetToPxForm(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        Exportation pxExportation = getExportation(jsonBody);
        return exportDatasetToPx(ctx, pxExportation, agencyID, resourceID, version, lang, filename);
    }


    public Response exportQueryToPxForm(ServiceContext ctx, String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        Exportation pxExportationBody = getExportation(jsonBody);
        return exportQueryToPx(ctx, pxExportationBody, agencyID, resourceID, lang, filename);
    }


    public Response exportSvgToImage(ServiceContext ctx, String svg, String filename, Float width, String mimeType) {
        FileOutputStream outputStream = null;
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "image");
            outputStream = new FileOutputStream(tmpFile);
            exportService.exportSvgToImage(ctx, svg, width, mimeType, outputStream);

            if (filename == null) {
                filename = "chart";
            }

            filename += SvgExportSupportedMimeType.getFileExtension(mimeType);

            return buildResponseOkWithFile(tmpFile, filename, mimeType);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStream);
        }
    }


    public Response exportSvgToImageForm(ServiceContext ctx, String svg, String filename, Float width, String mimeType) {
        return exportSvgToImage(ctx, svg, filename, width, mimeType);
    }

    private Dataset retrieveDataset(String urn, String lang, String dimensionSelection) throws MetamacException {
        String[] urnSplited = UrnUtils.splitUrnStructure(urn);
        String agencyID = urnSplited[0];
        String resourceID = urnSplited[1];
        String version = urnSplited[2];
        return retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);
    }

    private Response buildResponseOkWithFile(File file, String filename, String mimeType) throws FileNotFoundException {
        return Response.ok(new DeleteOnCloseFileInputStream(file), mimeType).header("Content-Disposition", "attachment; filename=" + filename).build();
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

    private Response exportIndicatorToPlainText(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String resourceID, String filename, String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForIndicator(exportationBody, resourceID);

        if (filename == null) {
            filename = ExportUtils.buildExportFilenameWithoutExtension(exportationBody, ResourceType.INDICATOR.getName(), resourceID);
        }

        return exportResourceAccessToPlainText(ctx, resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportIndicatorInstanceToPlainText(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String indicatorSystemCode, String resourceID, String filename,
            String fields) {
        ResourceAccess resourceAccess = buildResourceAccessForIndicatorInstance(exportationBody, indicatorSystemCode, resourceID);

        if (filename == null) {
            filename = ExportUtils.buildExportFilenameWithoutExtension(exportationBody, ResourceType.INDICATOR_INSTANCE.getName(), resourceID);
        }

        return exportResourceAccessToPlainText(ctx, resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportDatasetToPlainText(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename,
            String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForDataset(exportationBody, agencyID, resourceID, version, lang);

        if (filename == null) {
            filename = ExportUtils.buildExportFilenameWithoutExtension(exportationBody, ResourceType.DATASET.getName(), agencyID, resourceID, version);
        }

        return exportResourceAccessToPlainText(ctx, resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportQueryToPlainText(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, Exportation exportationBody, String agencyID, String resourceID, String lang, String filename, String fields) {

        ResourceAccess resourceAccess = buildResourceAccessForQuery(exportationBody, agencyID, resourceID, lang);

        if (filename == null) {
            filename = ExportUtils.buildExportFilenameWithoutExtension(exportationBody, ResourceType.QUERY.getName(), agencyID, resourceID);
        }

        return exportResourceAccessToPlainText(ctx, resourceAccess, filename, plainTextTypeEnum, fields);
    }

    private Response exportResourceAccessToPlainText(ServiceContext ctx, ResourceAccess resourceAccess, String proposedFilename, PlainTextTypeEnum plainTextTypeEnum, String fields) {

        FileOutputStream outputStreamObservations = null;
        FileOutputStream outputStreamAttributes = null;
        try {
            final File tmpFileObservations = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            outputStreamObservations = new FileOutputStream(tmpFileObservations);

            Set<String> parsedFields = PortalRestUtils.parseFieldsParameter(fields);

            boolean excludeAttributes = PortalRestUtils.containsField(parsedFields, RestCommonConstants.FIELD_EXCLUDE_ATTRIBUTES);
            if (excludeAttributes) {
                // Not zip
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.TSV, resourceAccess, outputStreamObservations);

                String filename = ExportUtils.addExtensionToFilenameIfNeeded(plainTextTypeEnum.getExtension(), proposedFilename + "-observations");
                return buildResponseOkWithFile(tmpFileObservations, filename, plainTextTypeEnum.getMimeType());
            } else {
                // Zip
                final File tmpFileAttributes = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
                outputStreamAttributes = new FileOutputStream(tmpFileAttributes);
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.TSV, resourceAccess, outputStreamObservations, outputStreamAttributes);

                String filename = ExportUtils.addExtensionToFilenameIfNeeded("zip", proposedFilename);
                String filenamePrefix = FilenameUtils.getBaseName(filename);
                File zipFile = generatePlainTextZip(plainTextTypeEnum, tmpFileObservations, tmpFileAttributes, filenamePrefix);
                return buildResponseOkWithFile(zipFile, filename, "application/octet-stream");
            }
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        } finally {
            IOUtils.closeQuietly(outputStreamObservations);
            IOUtils.closeQuietly(outputStreamAttributes);
        }

    }

    private ResourceAccess buildResourceAccessForDataset(Exportation exportationBody, String agencyID, String resourceID, String version, String lang) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            if (lang == null) {
                lang = langDefault;
            }
            return new ResourceAccess(dataset, datasetSelection, lang, langDefault);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForQuery(Exportation exportationBody, String agencyID, String resourceID, String lang) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            // Retrieve dataset
            Query query = retrieveQuery(agencyID, resourceID, lang, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(query.getData().getDimensions(), query.getMetadata().getAttributes(),
                    query.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            if (lang == null) {
                lang = langDefault;
            }
            return new ResourceAccess(query, null, datasetSelection, lang, langDefault);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForIndicator(Exportation exportationBody, String resourceID) {

        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            return new ResourceAccess(dataset, datasetSelection, langDefault, null);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    private ResourceAccess buildResourceAccessForIndicatorInstance(Exportation exportationBody, String indicatorSystemCode, String resourceID) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiRepresentationParameter(exportationBody);

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            DatasetSelection datasetSelection = DatasetSelectionMapper.datasetToDatasetSelection(dataset.getData().getDimensions(), dataset.getMetadata().getAttributes(),
                    dataset.getMetadata().getRelatedDsd(), exportationBody);

            String langDefault = portalConfiguration.retrieveLanguageDefault();
            return new ResourceAccess(dataset, datasetSelection, langDefault, null);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

}