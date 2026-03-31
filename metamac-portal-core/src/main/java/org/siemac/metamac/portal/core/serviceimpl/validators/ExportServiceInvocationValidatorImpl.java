package org.siemac.metamac.portal.core.serviceimpl.validators;

import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkMetadataRequired;

import java.io.OutputStream;
import java.util.List;

import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;

public class ExportServiceInvocationValidatorImpl extends BaseInvocationValidator {

    /* Dataset */

    public static void checkExportDatasetToExcel(DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportDatasetToTsv(DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportDatasetToCsvCommaSeparated(DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportDatasetToCsvSemicolonSeparated(DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    private static void checkExportDatasetToPlainText(DatasetBase dataset, DatasetSelection datasetSelection, OutputStream resultObservationsOutputStream, OutputStream resultAttributesOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultObservationsOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(resultAttributesOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
    }

    public static void checkExportDatasetToPx(DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
    }

    /* Query */

    public static void checkExportQueryToExcel(QueryBase query, DatasetBase relatedDataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(query, ServiceExceptionParameters.QUERY, exceptions);
        checkMetadataRequired(relatedDataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportQueryToTsv(QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream, OutputStream resultAttributesOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkExportQueryToPlainText(query, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportQueryToCsvCommaSeparated(QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportQueryToPlainText(query, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportQueryToCsvSemicolonSeparated(QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportQueryToPlainText(query, datasetSelection, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    private static void checkExportQueryToPlainText(QueryBase query, DatasetSelection datasetSelection, OutputStream resultObservationsOutputStream, OutputStream resultAttributesOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(query, ServiceExceptionParameters.QUERY, exceptions);
        checkMetadataRequired(resultObservationsOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(resultAttributesOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
    }

    public static void checkExportQueryToPx(QueryBase query, DatasetBase relatedDataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(query, ServiceExceptionParameters.QUERY, exceptions);
        checkMetadataRequired(relatedDataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
    }

    public static void checkExportResourceToPlainTextWithoutAttributes(PlainTextTypeEnum plainTextTypeEnum, ResourceAccess resourceAccess, OutputStream resultObservationsOutputStream,
                                                                       String decimalSeparator, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(resourceAccess, ServiceExceptionParameters.RESOURCE_ACCESS, exceptions);
        checkMetadataRequired(plainTextTypeEnum, ServiceExceptionParameters.PLAIN_TEXT_TYPE_ENUM, exceptions);
        checkMetadataRequired(resultObservationsOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportResourceToPlainText(PlainTextTypeEnum plainTextTypeEnum, ResourceAccess resourceAccess, OutputStream resultObservationsOutputStream,
                                                      OutputStream resultAttributesOutputStream, String decimalSeparator, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(resourceAccess, ServiceExceptionParameters.RESOURCE_ACCESS, exceptions);
        checkMetadataRequired(plainTextTypeEnum, ServiceExceptionParameters.PLAIN_TEXT_TYPE_ENUM, exceptions);
        checkMetadataRequired(resultObservationsOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(resultAttributesOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    /* SVG */

    public static void checkExportSvgToImage(String svg, Float width, String mimeType, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(svg, ServiceExceptionParameters.SVG, exceptions);
        // width, mimeType optional
    }

}
