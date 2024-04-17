package org.siemac.metamac.portal.core.serviceimpl;

import java.io.OutputStream;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.exporters.ExcelExporter;
import org.siemac.metamac.portal.core.exporters.ImageExporter;
import org.siemac.metamac.portal.core.exporters.PlainTextExporter;
import org.siemac.metamac.portal.core.exporters.PxExporter;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("exportService")
public class ExportServiceImpl extends ExportServiceImplBase {

    @Autowired
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Autowired
    private PortalConfiguration              portalConfiguration;

    /* Datasets */

    @Override
    public void exportDatasetToExcel(ServiceContext ctx, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToExcel(ctx, dataset, datasetSelection, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        Integer cellThreshold = portalConfiguration.retrieveExportExcelCellThreshold();
        String unitMeasureProperty = portalConfiguration.retrieveOptionalUnitMeasure();
        String unitMultiplierProperty = portalConfiguration.retrieveOptionalUnitMeasureMultiplier();
        ExcelExporter exporter = new ExcelExporter(dataset, datasetSelection, lang, langDefault, cellThreshold, unitMeasureProperty, unitMultiplierProperty);
        exporter.write(resultOutputStream);
    }

    @Override
    public void exportDatasetToTsv(ServiceContext ctx, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToTsv(ctx, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportDatasetToPlainText(PlainTextTypeEnum.TSV, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    @Override
    public void exportDatasetToCsvCommaSeparated(ServiceContext ctx, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    @Override
    public void exportDatasetToCsvSemicolonSeparated(ServiceContext ctx, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    private void exportDatasetToPlainText(PlainTextTypeEnum plainTextTypeEnum, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        PlainTextExporter exporter = new PlainTextExporter(plainTextTypeEnum, dataset, datasetSelection, lang, langDefault);
        exporter.writeObservationsAndAttributesWithObservationAttachmentLevel(resultObservationsOutputStream);
        exporter.writeAttributesWithDatasetAndDimensionAttachmentLevel(resultAttributesOutputStream);
    }

    @Override
    public void exportResourceToPlainText(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, ResourceAccess resourceAccess, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        PlainTextExporter exporter = new PlainTextExporter(plainTextTypeEnum, resourceAccess);
        exporter.writeObservationsAndAttributesWithObservationAttachmentLevel(resultObservationsOutputStream);
        exporter.writeAttributesWithDatasetAndDimensionAttachmentLevel(resultAttributesOutputStream);
    }

    @Override
    public void exportResourceToPlainTextWithoutAttributes(ServiceContext ctx, PlainTextTypeEnum plainTextTypeEnum, ResourceAccess resourceAccess, OutputStream resultObservationsOutputStream)
            throws MetamacException {
        PlainTextExporter exporter = new PlainTextExporter(plainTextTypeEnum, resourceAccess);
        exporter.writeObservationsAndAttributesWithObservationAttachmentLevel(resultObservationsOutputStream);
    }

    @Override
    public void exportDatasetToPx(ServiceContext ctx, DatasetBase dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToPx(ctx, dataset, datasetSelection, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }

        String unitMeasureProperty = portalConfiguration.retrieveOptionalUnitMeasure();
        String unitMultiplierProperty = portalConfiguration.retrieveOptionalUnitMeasureMultiplier();
        PxExporter exporter = new PxExporter(dataset, datasetSelection, lang, langDefault, unitMeasureProperty, unitMultiplierProperty);
        exporter.write(resultOutputStream);
    }

    /* Queries */

    @Override
    public void exportQueryToExcel(ServiceContext ctx, QueryBase query, DatasetBase relatedDataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportQueryToExcel(ctx, query, relatedDataset, datasetSelection, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        Integer cellThreshold = portalConfiguration.retrieveExportExcelCellThreshold();
        String unitMeasureProperty = portalConfiguration.retrieveOptionalUnitMeasure();
        String unitMultiplierProperty = portalConfiguration.retrieveOptionalUnitMeasureMultiplier();
        ExcelExporter exporter = new ExcelExporter(query, relatedDataset, datasetSelection, lang, langDefault, cellThreshold, unitMeasureProperty, unitMultiplierProperty);
        exporter.write(resultOutputStream);
    }

    @Override
    public void exportQueryToTsv(ServiceContext ctx, QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportQueryToTsv(ctx, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportQueryToPlainText(PlainTextTypeEnum.TSV, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    @Override
    public void exportQueryToCsvCommaSeparated(ServiceContext ctx, QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportQueryToCsvCommaSeparated(ctx, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportQueryToPlainText(PlainTextTypeEnum.CSV_COMMA, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    @Override
    public void exportQueryToCsvSemicolonSeparated(ServiceContext ctx, QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportQueryToCsvSemicolonSeparated(ctx, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
        exportQueryToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, query, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);
    }

    private void exportQueryToPlainText(PlainTextTypeEnum plainTextTypeEnum, QueryBase query, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        PlainTextExporter exporter = new PlainTextExporter(plainTextTypeEnum, query, datasetSelection, lang, langDefault);
        exporter.writeObservationsAndAttributesWithObservationAttachmentLevel(resultObservationsOutputStream);
        exporter.writeAttributesWithDatasetAndDimensionAttachmentLevel(resultAttributesOutputStream);
    }

    @Override
    public void exportQueryToPx(ServiceContext ctx, QueryBase query, DatasetBase relatedDataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportQueryToPx(ctx, query, relatedDataset, datasetSelection, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }

        String unitMeasureProperty = portalConfiguration.retrieveOptionalUnitMeasure();
        String unitMultiplierProperty = portalConfiguration.retrieveOptionalUnitMeasureMultiplier();
        PxExporter exporter = new PxExporter(query, relatedDataset, datasetSelection, lang, langDefault, unitMeasureProperty, unitMultiplierProperty);
        exporter.write(resultOutputStream);
    }

    /* SVG */

    @Override
    public void exportSvgToImage(ServiceContext ctx, String svg, Float width, String mimeType, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportSvgToImage(ctx, svg, width, mimeType, resultOutputStream);

        ImageExporter exporter = new ImageExporter(svg, width, mimeType);
        exporter.write(resultOutputStream);
    }

}