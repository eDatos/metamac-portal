package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.invocation.SrmRestExternalFacadeImpl;
import org.siemac.metamac.portal.core.serviceapi.utils.Asserts;
import org.siemac.metamac.portal.core.serviceapi.utils.AssertsUtils;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.QueryMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.XMLUtils;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.portal.core.serviceimpl.ExportServiceImpl;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ComponentType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Concept;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Quantity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/portal/applicationContext-test.xml"})
@TransactionConfiguration(transactionManager = "txManagerCore", defaultRollback = true)
@Transactional
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ExportServiceTest implements ExportServiceTestBase {

    @Autowired
    @Spy
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Autowired
    @Spy
    private PortalConfiguration              portalConfiguration;

    @Mock
    private SrmRestExternalFacadeImpl        srmRestExternalFacade;

    @InjectMocks
    private ExportServiceImpl                exportService;

    @Rule
    public TemporaryFolder                   tempFolder = new TemporaryFolder();

    private final ServiceContext             ctx        = getServiceContext();

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        resetMocks();
    }

    @Override
    public void testExportDatasetToExcel() throws Exception {
        // Tested in testExportDatasetToExcel* methods
    }

    @Test
    public void testExportDatasetToExcelWithCodes() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportDatasetToExcelWithCodes.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithCodes.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportDatasetWithMeasureDimensionToExcelWithCodes() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportDatasetWithMeasureDimensionToExcelWithCodes.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetWithMeasureDimensionToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithMeasureDimensionWithCodes.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportDatasetToExcelWithLabels() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportDatasetToExcelWithLabels.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithLabels.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportDatasetToExcelWithLabelsAndCodes() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, null).dimensionValues("INDICE_OCUPACION_PLAZAS")// do not specify visualisation mode (apply default)
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportDatasetToExcelWithLabelsAndCodes.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        // byte[] expected = new byte[]{-66, -1, -51, 126, 26, -33, -48, -44, 11, -107, -128, 26, -3, 121, -59, -89};
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithLabelsAndCodes.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Override
    public void testExportQueryToExcel() throws Exception {
        // Tested in testExportQueryToExcel* methods
    }

    @Test
    public void testExportQueryToExcelWithCodes() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportQueryToExcelWithCodes.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Query query = buildQueryToExport();
        Dataset relatedDataset = buildDatasetToExport();
        exportService.exportQueryToExcel(ctx, query, relatedDataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithCodes.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportQueryToExcelWithLabels() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportQueryToExcelWithLabels.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Query query = buildQueryToExport();
        Dataset relatedDataset = buildDatasetToExport();
        exportService.exportQueryToExcel(ctx, query, relatedDataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithLabels.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportQueryToExcelWithLabelsAndCodes() throws Exception {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, null).dimensionValues("INDICE_OCUPACION_PLAZAS")// do not specify visualisation mode (apply default)
                .build();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        // tmpFile = new File("W:/temp/Excel_TEST/testExportQueryToExcelWithLabelsAndCodes.xlsx");
        FileOutputStream out = new FileOutputStream(tmpFile);

        Query query = buildQueryToExport();
        Dataset relatedDataset = buildDatasetToExport();
        exportService.exportQueryToExcel(ctx, query, relatedDataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        // byte[] expected = new byte[]{-66, -1, -51, 126, 26, -33, -48, -44, 11, -107, -128, 26, -3, 121, -59, -89};
        InputStream resourceAsStream = ExportServiceTest.class.getResourceAsStream("/resources/export/DatasetWithLabelsAndCodes.xlsx");
        Asserts.assertBytesArray(AssertsUtils.createExcelContentHash(resourceAsStream), AssertsUtils.createExcelContentHash(tmpFile));
    }

    @Override
    public void testExportDatasetToTsv() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Override
    public void testExportDatasetToCsvCommaSeparated() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Override
    public void testExportDatasetToCsvSemicolonSeparated() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Test
    public void testExportDatasetToPlainTextWithCodes() throws Exception {

        Dataset dataset = buildDatasetToExport();

        DatasetSelection datasetSelection = buildDatasetSelection2();

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodes(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A" + separator + "a1",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A2" + separator + "a2",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "NOTEX" + separator + "a3",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn1",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn2",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "da1",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator
                + "ca1", bufferedReaderAttributes.readLine());
        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator
                + "ca3", bufferedReaderAttributes.readLine());
        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4",
                bufferedReaderAttributes.readLine());
        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + "ca5",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_3",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_4",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_6", bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_8", bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_6", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());

        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodes(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReaderObservations = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_E", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY
                + separator + "d3" + separator + "e3", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "4" + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + "d4" + separator + "e4", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY
                + separator + "d1" + separator + "e1", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "2" + separator + "b2" + separator + StringUtils.EMPTY
                + separator + "d2" + separator + "e2", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7" + separator
                + StringUtils.EMPTY + separator + "d7" + separator + "e7", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "8" + separator + "b8" + separator + StringUtils.EMPTY
                + separator + "d8" + separator + "e8", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY
                + separator + "d5" + separator + "e5", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "6" + separator + "b6" + separator + StringUtils.EMPTY
                + separator + "d6" + separator + "e6", bufferedReaderObservations.readLine());
        assertEquals(null, bufferedReaderObservations.readLine());
        bufferedReaderObservations.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodesForSubselection(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReaderObservations = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_E", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7" + separator
                + StringUtils.EMPTY + separator + "d7" + separator + "e7", bufferedReaderObservations.readLine());
        assertEquals(null, bufferedReaderObservations.readLine());
        bufferedReaderObservations.close();
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodesForSubselection(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A" + separator + "a1",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A2" + separator + "a2",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "NOTEX" + separator + "a3",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn2",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator
                + "ca1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator
                + "ca3", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_4",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7",
                bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());

        bufferedReaderAttributes.close();
    }

    @Test
    public void testExportDatasetToPlainTextWithLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 21, LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.LABEL)
                .attribute("NOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.LABEL)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.LABEL)
                .build();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // Csv comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // Csv semi colon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentLabels(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE",
                bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_A" + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_A2" + separator + "a2 Label", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "NOTEX" + separator + "a3 Label", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "" + separator + "" + separator + "" + separator + "VALUENOTEX" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "" + separator + "" + separator + "" + separator + "VALUENOTEX" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "da1 Label", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("" + separator + "" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("" + separator + "" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("" + separator + "" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("" + separator + "" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + "ca 5 Label",
                bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "Índice de ocupación de plazas" + separator + "INDICADORES_A" + separator + "ioA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "Año 2012" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "Año 2013" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2012" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2013" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_3",
                    bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_5",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_7",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_C" + separator + "cnC_1 Label",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "cnC_1 Label",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "cnC_2 Label", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "cnC_6 Label", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentLabels(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);

        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_E", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "3" + separator + "b3 Label"
                    + separator + "" + separator + "d3 Label" + separator + "e3", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "3" + separator + "b3 Label" + separator
                    + "" + separator + "d3 Label" + separator + "e3", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "4" + separator + "" + separator + "" + separator
                + "d4 Label" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "1.1" + separator + "b1 Label"
                    + separator + "" + separator + "d1 Label" + separator + "e1", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "1.1" + separator + "b1 Label" + separator
                    + "" + separator + "d1 Label" + separator + "e1", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "2" + separator + "b2 Label" + separator + ""
                + separator + "d2 Label" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "" + separator + "b7 Label" + separator
                    + "" + separator + "d7 Label" + separator + "e7", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "" + separator + "b7 Label" + separator + ""
                    + separator + "d7 Label" + separator + "e7", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "8" + separator + "b8 Label" + separator + ""
                + separator + "d8 Label" + separator + "e8", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "5" + separator + "b5 Label" + separator
                    + "" + separator + "d5 Label" + separator + "e5", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "5" + separator + "b5 Label" + separator + ""
                    + separator + "d5 Label" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "6" + separator + "b6 Label" + separator + ""
                + separator + "d6 Label" + separator + "e6", bufferedReader.readLine());

        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToPlainTextWithCodesAndLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 21, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .build();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "TIME_PERIOD_CODE" + separator + "CATEGORIA_ALOJAMIENTO" + separator
                + "CATEGORIA_ALOJAMIENTO_CODE" + separator + "INDICADORES" + separator + "INDICADORES_CODE" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE" + separator
                + "ATTRIBUTE_VALUE_CODE", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A" + separator + "a1" + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A2" + separator + "a2 Label" + separator + "a2", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "NOTEX" + separator + "a3 Label" + separator + "a3", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn1" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn2" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals(
                "Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                        + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "da1 Label" + separator + "da1",
                bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals(
                    StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS"
                            + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                        + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2" + separator + "ca2",
                bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals(
                    StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS"
                            + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                        + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4" + separator + "ca4",
                bufferedReaderAttributes.readLine());
        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                        + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + "ca 5 Label" + separator + "ca5",
                bufferedReaderAttributes.readLine());
        assertEquals(
                StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                        + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1" + separator + "ioA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_1" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_2" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_3" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_4" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_2" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_6" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_8" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_1 Label" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_1 Label" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_2 Label" + separator + "cnC_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_6 Label" + separator + "cnC_6", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "TIME_PERIOD_CODE" + separator + "CATEGORIA_ALOJAMIENTO" + separator
                + "CATEGORIA_ALOJAMIENTO_CODE" + separator + "INDICADORES" + separator + "INDICADORES_CODE" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B" + separator + "ATTRIBUTE_B_CODE"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_C_CODE" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_D_CODE" + separator + "ATTRIBUTE_E" + separator + "ATTRIBUTE_E_CODE",
                bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3 Label" + separator + "b3" + separator + StringUtils.EMPTY + separator
                    + "d3 Label" + separator + "d3" + separator + "e3" + separator + "e3", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3 Label" + separator + "b3" + separator + StringUtils.EMPTY + separator
                    + "d3 Label" + separator + "d3" + separator + "e3" + separator + "e3", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "4" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + "d4 Label" + separator + "d4" + separator + "e4" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1 Label" + separator + "b1" + separator + StringUtils.EMPTY
                    + separator + "d1 Label" + separator + "d1" + separator + "e1" + separator + "e1", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1 Label" + separator + "b1" + separator + StringUtils.EMPTY
                    + separator + "d1 Label" + separator + "d1" + separator + "e1" + separator + "e1", bufferedReader.readLine());
        }
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "2" + separator + "b2 Label" + separator + "b2" + separator + StringUtils.EMPTY + separator
                + "d2 Label" + separator + "d2" + separator + "e2" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7 Label" + separator + "b7" + separator
                    + StringUtils.EMPTY + separator + "d7 Label" + separator + "d7" + separator + "e7" + separator + "e7", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7 Label" + separator + "b7" + separator
                    + StringUtils.EMPTY + separator + "d7 Label" + separator + "d7" + separator + "e7" + separator + "e7", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "8" + separator + "b8 Label" + separator + "b8" + separator + StringUtils.EMPTY + separator
                + "d8 Label" + separator + "d8" + separator + "e8" + separator + "e8", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5 Label" + separator + "b5" + separator + StringUtils.EMPTY + separator
                    + "d5 Label" + separator + "d5" + separator + "e5" + separator + "e5", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5 Label" + separator + "b5" + separator + StringUtils.EMPTY + separator
                    + "d5 Label" + separator + "d5" + separator + "e5" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "6" + separator + "b6 Label" + separator + "b6" + separator + StringUtils.EMPTY + separator
                + "d6 Label" + separator + "d6" + separator + "e6" + separator + "e6", bufferedReader.readLine());

        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToPlainTextWithCodesAndSomeLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        DatasetSelection datasetSelection = buildDatasetSelection1();

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.TSV.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.TSV.getSeparator());
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_COMMA.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_COMMA.getSeparator());
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());
        }
    }

    @Override
    public void testExportQueryToTsv() throws Exception {
        // Tested in testExportQueryToPlainText* methods
    }

    @Override
    public void testExportQueryToCsvCommaSeparated() throws Exception {
        // Tested in testExportQueryToPlainText* methods
    }

    @Override
    public void testExportQueryToCsvSemicolonSeparated() throws Exception {
        // Tested in testExportQueryToPlainText* methods
    }

    @Test
    public void testExportQueryToPlainTextWithCodes() throws Exception {

        Query query = buildQueryToExport();

        DatasetSelection datasetSelection = buildDatasetSelection2();

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToTsv(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvCommaSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvSemicolonSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    @Test
    public void testExportQueryWithSelectionToPlainTextWithCodes() throws Exception {

        Query query = buildQueryToExport();

        DatasetSelection datasetSelection = buildDatasetSelection3();

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToTsv(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvCommaSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvSemicolonSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesForSubselection(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    @Test
    public void testExportQueryToPlainTextWithCodesAndLabels() throws Exception {

        Query query = buildQueryToExport();

        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 21, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .build();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToTsv(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvCommaSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvSemicolonSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    @Test
    public void testExportQueryToPlainTextWithCodesAndSomeLabels() throws Exception {

        Query query = buildQueryToExport();

        DatasetSelection datasetSelection = buildDatasetSelection1();

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToTsv(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.TSV.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.TSV.getSeparator());
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvCommaSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_COMMA.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_COMMA.getSeparator());
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportQueryToCsvSemicolonSeparated(ctx, query, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());
        }
    }

    @Override
    @Test
    public void testExportResourceToPlainText() throws Exception {
        {
            Query query = buildQueryToExport();

            DatasetSelection datasetSelection = buildDatasetSelection1();

            {
                // TSV
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.TSV, resourceAccess, outObservations, outAttributes);

                outObservations.close();
                outAttributes.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.TSV.getSeparator());

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.TSV.getSeparator());
            }

            {
                // CSV comma separated
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.CSV_COMMA, resourceAccess, outObservations, outAttributes);

                outObservations.close();
                outAttributes.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_COMMA.getSeparator());

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_COMMA.getSeparator());
            }

            {
                // CSV semicolon separated
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.CSV_SEMICOLON, resourceAccess, outObservations, outAttributes);

                outObservations.close();
                outAttributes.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());
            }
        }
        {

            Dataset dataset = buildDatasetToExport();

            DatasetSelection datasetSelection = buildDatasetSelection2();

            {
                // TSV
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.TSV, resourceAccess, outObservations, outAttributes);

                outObservations.close();
                outAttributes.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
            }

            {
                // CSV comma separated
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.CSV_COMMA, resourceAccess, outObservations, outAttributes);
                outObservations.close();
                outAttributes.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
            }

            {
                // CSV semicolon separated
                File tmpFileObservations = tempFolder.newFile();
                File tmpFileAttributes = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
                FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainText(ctx, PlainTextTypeEnum.CSV_SEMICOLON, resourceAccess, outObservations, outAttributes);

                outObservations.close();
                outAttributes.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

                // Validate attributes with dataset and dimension attachment
                validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
            }
        }
    }

    @Override
    @Test
    public void testExportResourceToPlainTextWithoutAttributes() throws Exception {
        {
            Query query = buildQueryToExport();

            DatasetSelection datasetSelection = buildDatasetSelection1();

            {
                // TSV
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.TSV, resourceAccess, outObservations);

                outObservations.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.TSV.getSeparator());
            }

            {
                // CSV comma separated
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.CSV_COMMA, resourceAccess, outObservations);

                outObservations.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_COMMA.getSeparator());
            }

            {
                // CSV semicolon separated
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, query, null, datasetSelection, "es", "es");
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.CSV_SEMICOLON, resourceAccess, outObservations);

                outObservations.close();

                // Validate attributes with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());
            }
        }
        {

            Dataset dataset = buildDatasetToExport();

            DatasetSelection datasetSelection = buildDatasetSelection2();

            {
                // TSV
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.TSV, resourceAccess, outObservations);

                outObservations.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);
            }

            {
                // CSV comma separated
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.CSV_COMMA, resourceAccess, outObservations);
                outObservations.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);
            }

            {
                // CSV semicolon separated
                File tmpFileObservations = tempFolder.newFile();
                FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);

                ResourceAccess resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, "es", null);
                exportService.exportResourceToPlainTextWithoutAttributes(ctx, PlainTextTypeEnum.CSV_SEMICOLON, resourceAccess, outObservations);

                outObservations.close();

                // Validate observations with dataset and dimension attachment
                validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);
            }
        }
    }

    @Test
    @Override
    public void testExportQueryToPx() throws Exception {
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create().dimension("DESTINO_ALOJAMIENTO", 1, LabelVisualisationModeEnum.CODE_AND_LABEL)
                .dimensionValues("FUERTEVENTURA", "GRAN_CANARIA", "LANZAROTE", "EL_HIERRO", "LA_GOMERA", "LA_PALMA", "TENERIFE")
                .dimension("CATEGORIA_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("TOTAL").dimension("TIME_PERIOD", 21, LabelVisualisationModeEnum.CODE_AND_LABEL)
                .dimensionValues("2013", "2012").dimension("INDICADORES", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS").build();
        {
            Query query = XMLUtils.getQuery(XMLUtils.class.getResourceAsStream("/resources/INDICADORES_OCUPACION.xml"));
            Dataset relatedDataset = XMLUtils.getDataset(XMLUtils.class.getResourceAsStream("/resources/C00031A_000001.xml"));

            File tmpFile = tempFolder.newFile();
            FileOutputStream out = new FileOutputStream(tmpFile);
            exportService.exportQueryToPx(ctx, query, relatedDataset, datasetSelection, null, out);
            out.close();

            // Check checksum
            InputStream responseExpected = ExportServiceTest.class.getResourceAsStream("/resources/export/queries/query-ISTAC-INDICADORES_OCUPACION.px");
            assertEqualsResponseIdentical(responseExpected, new FileInputStream(tmpFile));
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(File tmpFileAttributes, String separator) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator
                + "INDICADORES_CODE" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE" + separator + "ATTRIBUTE_VALUE_CODE", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_A" + separator + StringUtils.EMPTY + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_A2" + separator + StringUtils.EMPTY + separator + "a2", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "NOTEX" + separator + "a3 Label" + separator + StringUtils.EMPTY, bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "VALUENOTEX" + separator + "vn1" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "VALUENOTEX" + separator + "vn2" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "da1 Label" + separator + StringUtils.EMPTY, bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1", bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2" + separator + "ca2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3", bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4" + separator + "ca4", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + StringUtils.EMPTY + separator + "ca5", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "Índice de ocupación de plazas" + separator
                + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1" + separator + "ioA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_A" + separator + "cnA_1" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_A" + separator + "cnA_2" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A"
                + separator + "cnA_3" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A"
                + separator + "cnA_4" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_B" + separator + "cnB_2" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B"
                + separator + "cnB_6" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B"
                + separator + "cnB_8" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_C" + separator + "cnC_1 Label" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_C" + separator + "cnC_1 Label" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_C" + separator + "cnC_2 Label" + separator + "cnC_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C"
                + separator + "cnC_6 Label" + separator + "cnC_6", bufferedReaderAttributes.readLine());

        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(File tmpFileObservations, String separator) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator
                + "INDICADORES_CODE" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B" + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_C_CODE" + separator + "ATTRIBUTE_D" + separator
                + "ATTRIBUTE_D_CODE" + separator + "ATTRIBUTE_E", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(
                    "Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                            + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY + separator + "d3 Label" + separator + "d3" + separator + "e3",
                    bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY + separator + "d3 Label" + separator + "d3" + separator + "e3",
                    bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "4" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "d4 Label" + separator + "d4" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(
                    "Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                            + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY + separator + "d1 Label" + separator + "d1" + separator + "e1",
                    bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY + separator + "d1 Label" + separator + "d1" + separator + "e1",
                    bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "2" + separator + "b2" + separator + StringUtils.EMPTY + separator + "d2 Label" + separator + "d2" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(
                    "Aragón" + separator + "ARAGON" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                            + separator + StringUtils.EMPTY + separator + "b7" + separator + StringUtils.EMPTY + separator + "d7 Label" + separator + "d7" + separator + "e7",
                    bufferedReader.readLine());
        } else {
            assertEquals(
                    "Aragón" + separator + "ARAGON" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                            + separator + StringUtils.EMPTY + separator + "b7" + separator + StringUtils.EMPTY + separator + "d7 Label" + separator + "d7" + separator + "e7",
                    bufferedReader.readLine());
        }
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "8" + separator + "b8" + separator + StringUtils.EMPTY + separator + "d8 Label" + separator + "d8" + separator + "e8", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY + separator + "d5 Label" + separator + "d5" + separator + "e5",
                    bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                    + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY + separator + "d5 Label" + separator + "d5" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "6" + separator + "b6" + separator + StringUtils.EMPTY + separator + "d6 Label" + separator + "d6" + separator + "e6", bufferedReader.readLine());

        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Override
    @Test
    public void testExportDatasetToPx() throws Exception {
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create().dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL)
                .dimensionValues("CANARIAS", "LAS_PALMAS", "FUERTEVENTURA", "GRAN_CANARIA", "LANZAROTE", "SANTA_CRUZ_TNF", "EL_HIERRO", "LA_GOMERA", "LA_PALMA", "TENERIFE")
                .dimension("CATEGORIA_ALOJAMIENTO", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("TIME_PERIOD", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012").dimension("INDICADORES", 21, LabelVisualisationModeEnum.CODE_AND_LABEL)
                .dimensionValues("INDICE_OCUPACION_PLAZAS").build();
        {
            Dataset dataset = XMLUtils.getDataset(XMLUtils.class.getResourceAsStream("/resources/C00031A_000002.xml"));

            File tmpFile = tempFolder.newFile();
            // tmpFile = new File("W:/temp/Px_TEST/archivo.px");
            FileOutputStream out = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(ctx, dataset, datasetSelection, null, out);
            out.close();

            // Check checksum
            InputStream responseExpected = ExportServiceTest.class.getResourceAsStream("/resources/export/archivo.px");
            assertEqualsResponseIdentical(responseExpected, new FileInputStream(tmpFile));
        }

        {
            Dataset dataset = XMLUtils.getDataset(XMLUtils.class.getResourceAsStream("/resources/C00031A_000003.xml"));

            File tmpFile = tempFolder.newFile();
            // tmpFile = new File("W:/temp/Px_TEST/testExportDatasetToPxEnglish.px");
            FileOutputStream out = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(ctx, dataset, datasetSelection, "en", out);
            out.close();

            // Check checksum
            InputStream responseExpected = ExportServiceTest.class.getResourceAsStream("/resources/export/testExportDatasetToPxEnglish.px");
            assertEqualsResponseIdentical(responseExpected, new FileInputStream(tmpFile));
        }

        {
            Dataset dataset = XMLUtils.getDataset(XMLUtils.class.getResourceAsStream("/resources/C00031A_000002_ATTR_MEASURE.xml"));

            File tmpFile = tempFolder.newFile();
            // tmpFile = new File("W:/temp/Px_TEST/ContVariable.px");
            FileOutputStream out = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(ctx, dataset, datasetSelection, null, out);
            out.close();

            // Check checksum
            InputStream responseExpected = ExportServiceTest.class.getResourceAsStream("/resources/export/ContVariable.px");
            assertEqualsResponseIdentical(responseExpected, new FileInputStream(tmpFile));
        }
    }

    private static void assertEqualsResponseIdentical(InputStream responseExpected, InputStream responseActual) {
        try {
            String actual = IOUtils.toString(responseActual);
            if (StringUtils.isBlank(actual)) {
                Assert.fail("actual response is blank");
            }
            actual = actual.replaceAll("[\n\r]", StringUtils.EMPTY);
            String expected = IOUtils.toString(responseExpected);
            if (StringUtils.isBlank(expected)) {
                Assert.fail("expected response is blank");
            }
            expected = expected.replaceAll("[\n\r]", StringUtils.EMPTY);

            assertEquals(expected, actual);
        } catch (Exception e) {
            Assert.fail("Fail comparing responses: " + e.getMessage());
        }
    }

    @Override
    @Test
    public void testExportSvgToImage() throws Exception {
        //@formatter:off
        // No test
        String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">" +
                        "<g fill=\"none\">" +
                            "<path stroke=\"blue\" d=\"M5 60 l215 0\" />" +
                        "</g>" +
                     "</svg>";

        //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        exportService.exportSvgToImage(ctx, svg, null, null, out);

        out.close();

        // Validation: nothing special... Only test service does not throw error and generate a PNG
        assertTrue(tmpFile.length() > 0);
        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertTrue(bufferedReader.readLine().contains("PNG"));
    }

    private ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }

    private Dataset buildDatasetWithMeasureDimensionToExport() {
        return buildDatasetToExport(DimensionType.MEASURE_DIMENSION);
    }

    private Dataset buildDatasetToExport() {
        return buildDatasetToExport(DimensionType.DIMENSION);
    }

    private Dataset buildDatasetToExport(DimensionType dimensionType) {
        //@formatter:off
        return DatasetMockBuilder.create()
                // DIMENSIONS DEFINITIONS
                .dimension("DESTINO_ALOJAMIENTO", "Destino de alojamiento").heading().dimensionValue("ANDALUCIA", "Andalucía").dimensionValue("ARAGON", "Aragón")
                .dimension("TIME_PERIOD", "Periodo de tiempo").heading().dimensionValue("2012", "Año 2012").dimensionValue("2013", "Año 2013")
                .dimension("CATEGORIA_ALOJAMIENTO", "Categoría del alojamiento").stub().dimensionValue("1_2_3_ESTRELLAS", "1, 2 y 3 estrellas").dimensionValue("4_5_ESTRELLAS", "4 y 5 estrellas")
                .dimension("INDICADORES", "Indicadores", dimensionType).stub().dimensionValue("INDICE_OCUPACION_PLAZAS", "Índice de ocupación de plazas")

                // DATASET ATTRIBUTES DEFINITIONS
                .attribute("ATTRIBUTE_A", "Attribute A", AttributeAttachmentLevelType.DATASET, ComponentType.OTHER)
                        .attributeData("ATTRIBUTE_A", "a1")
                .attribute("ATTRIBUTE_A2", "Attribute A2", AttributeAttachmentLevelType.DATASET, ComponentType.MEASURE)
                        .attributeValue("a2", "a2 Label")
                        .attributeData("ATTRIBUTE_A2", "a2")
                .attribute("NOTEX", "Attribute Notex", AttributeAttachmentLevelType.DATASET, ComponentType.OTHER)
                        .attributeValue("a3", "a3 Label")
                        .attributeData("NOTEX", "a3")

                // DIMENSION ATTRIBUTES DEFINITIONS
                .attribute("VALUENOTEX", "ValueNotex", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO")
                        .attributeData("VALUENOTEX", "vn1 | vn2")
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "AttrDestinoAlojamiento01", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO")
                        .attributeValue("da1", "da1 Label")
                        .attributeData("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "da1 | ")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "AttrCategoriaAlojamiento01", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                        .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "ca1 | ca2")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "AttrCategoriaAlojamiento02", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                        .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "ca3 | ca4")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", "AttrCategoriaAlojamiento03", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                        .attributeValue("ca5", "ca 5 Label")
                        .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", " | ca5")
                .attribute("INDICADORES_A", "Attribute Indicadores A", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("INDICADORES")
                        .attributeData("INDICADORES_A", "ioA_1")
                .attribute("CELLNOTE_A", "Attribute CellNote A", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD")
                        .attributeData("CELLNOTE_A", "cnA_1 | cnA_2 | cnA_3 | cnA_4")
                .attribute("CELLNOTE_B", "Attribute CellNote B", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD", "CATEGORIA_ALOJAMIENTO")
                        .attributeData("CELLNOTE_B", "cnB_1 | cnB_2 | cnB_3 |  | cnB_5 | cnB_6 | cnB_7 | cnB_8")
                .attribute("CELLNOTE_C", "Attribute CellNote C", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("TIME_PERIOD", "CATEGORIA_ALOJAMIENTO", "DESTINO_ALOJAMIENTO") // unordered in attribute definition
                           .attributeValue("cnC_1", "cnC_1 Label").attributeValue("cnC_2", "cnC_2 Label").attributeValue("cnC_6", "cnC_6 Label")
                        .attributeData("CELLNOTE_C", "cnC_1 | cnC_2 |  |  |  | cnC_6 |  | ")

                // PRIMARY MEASURE DEFINITIONS
                .attribute("ATTRIBUTE_B", "Attribute B", AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                           .attributeValue("b1", "b1 Label").attributeValue("b2", "b2 Label").attributeValue("b3", "b3 Label")
                           .attributeValue("b4", "b4 Label").attributeValue("b5", "b5 Label").attributeValue("b6", "b6 Label")
                           .attributeValue("b7", "b7 Label").attributeValue("b8", "b8 Label").attributeValue("b9", "b9 Label")
                           .attributeData("ATTRIBUTE_B", "b1 | b2 | b3 |  | b5 | b6 | b7 | b8")
                .attribute("ATTRIBUTE_C", "Attribute C",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                            // No data
                .attribute("ATTRIBUTE_D", "Attribute D",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                           .attributeValue("d1", "d1 Label").attributeValue("d2", "d2 Label").attributeValue("d3", "d3 Label")
                           .attributeValue("d4", "d4 Label").attributeValue("d5", "d5 Label").attributeValue("d6", "d6 Label")
                           .attributeValue("d7", "d7 Label").attributeValue("d8", "d8 Label").attributeValue("d9", "d9 Label")
                           .attributeData("ATTRIBUTE_D", "d1 | d2 | d3 | d4 | d5 | d6 | d7 | d8")
                .attribute("ATTRIBUTE_E", "Attribute E",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                            .attributeData("ATTRIBUTE_E", "e1 | e2 | e3 | e4 | e5 | e6 | e7 | e8")

                // OBSERVATIONS
                .observations("1.1 | 2 | 3 | 4 | 5 | 6 |  | 8")
                .build();
        //@formatter:on
    }

    private Query buildQueryToExport() {
        //@formatter:off
        return QueryMockBuilder.create()
                // DIMENSIONS DEFINITIONS
                .dimension("DESTINO_ALOJAMIENTO", "Destino de alojamiento").heading().dimensionValue("ANDALUCIA", "Andalucía").dimensionValue("ARAGON", "Aragón")
                .dimension("TIME_PERIOD", "Periodo de tiempo").heading().dimensionValue("2012", "Año 2012").dimensionValue("2013", "Año 2013")
                .dimension("CATEGORIA_ALOJAMIENTO", "Categoría del alojamiento").stub().dimensionValue("1_2_3_ESTRELLAS", "1, 2 y 3 estrellas").dimensionValue("4_5_ESTRELLAS", "4 y 5 estrellas")
                .dimension("INDICADORES", "Indicadores").stub().dimensionValue("INDICE_OCUPACION_PLAZAS", "Índice de ocupación de plazas")

                // DATASET ATTRIBUTES DEFINITIONS
                .attribute("ATTRIBUTE_A", "Attribute A", AttributeAttachmentLevelType.DATASET, ComponentType.OTHER)
                .attribute("ATTRIBUTE_A2", "Attribute A2", AttributeAttachmentLevelType.DATASET, ComponentType.MEASURE)
                        .attributeValue("a2", "a2 Label")
                .attribute("NOTEX", "Attribute Notex", AttributeAttachmentLevelType.DATASET, ComponentType.OTHER)
                        .attributeValue("a3", "a3 Label")

                // DIMENSION ATTRIBUTES DEFINITIONS
                .attribute("VALUENOTEX", "ValueNotex", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO")
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "AttrDestinoAlojamiento01", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO")
                        .attributeValue("da1", "da1 Label")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "AttrCategoriaAlojamiento01", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "AttrCategoriaAlojamiento02", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", "AttrCategoriaAlojamiento03", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                        .attributeValue("ca5", "ca 5 Label")
                .attribute("INDICADORES_A", "Attribute Indicadores A", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("INDICADORES")
                .attribute("CELLNOTE_A", "Attribute CellNote A", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD")
                .attribute("CELLNOTE_B", "Attribute CellNote B", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD", "CATEGORIA_ALOJAMIENTO")
                .attribute("CELLNOTE_C", "Attribute CellNote C", AttributeAttachmentLevelType.DIMENSION, ComponentType.OTHER)
                        .dimensionsAttached("TIME_PERIOD", "CATEGORIA_ALOJAMIENTO", "DESTINO_ALOJAMIENTO") // unordered in attribute definition
                           .attributeValue("cnC_1", "cnC_1 Label").attributeValue("cnC_2", "cnC_2 Label").attributeValue("cnC_6", "cnC_6 Label")

                // PRIMARY MEASURE DEFINITIONS
                .attribute("ATTRIBUTE_B", "Attribute B", AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                           .attributeValue("b1", "b1 Label").attributeValue("b2", "b2 Label").attributeValue("b3", "b3 Label")
                           .attributeValue("b4", "b4 Label").attributeValue("b5", "b5 Label").attributeValue("b6", "b6 Label")
                           .attributeValue("b7", "b7 Label").attributeValue("b8", "b8 Label").attributeValue("b9", "b9 Label")
                .attribute("ATTRIBUTE_C", "Attribute C",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                .attribute("ATTRIBUTE_D", "Attribute D",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)
                           .attributeValue("d1", "d1 Label").attributeValue("d2", "d2 Label").attributeValue("d3", "d3 Label")
                           .attributeValue("d4", "d4 Label").attributeValue("d5", "d5 Label").attributeValue("d6", "d6 Label")
                           .attributeValue("d7", "d7 Label").attributeValue("d8", "d8 Label").attributeValue("d9", "d9 Label")
                .attribute("ATTRIBUTE_E", "Attribute E",AttributeAttachmentLevelType.PRIMARY_MEASURE, ComponentType.OTHER)

                // OBSERVATIONS
                .observations("1.1 | 2 | 3 | 4 | 5 | 6 |  | 8")

                // ATTRIBUTE INSTANCES
                .attributeData("ATTRIBUTE_A", "a1")
                .attributeData("ATTRIBUTE_A2", "a2")
                .attributeData("NOTEX", "a3")
                .attributeData("VALUENOTEX", "vn1 | vn2")
                .attributeData("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "da1 | ")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "ca1 | ca2")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "ca3 | ca4")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", " | ca5")
                .attributeData("INDICADORES_A", "ioA_1")
                .attributeData("CELLNOTE_A", "cnA_1 | cnA_2 | cnA_3 | cnA_4")
                .attributeData("CELLNOTE_B", "cnB_1 | cnB_2 | cnB_3 |  | cnB_5 | cnB_6 | cnB_7 | cnB_8")
                .attributeData("CELLNOTE_C", "cnC_1 | cnC_2 |  |  |  | cnC_6 |  | ")
                .attributeData("ATTRIBUTE_B", "b1 | b2 | b3 |  | b5 | b6 | b7 | b8")
                .attributeData("ATTRIBUTE_D", "d1 | d2 | d3 | d4 | d5 | d6 | d7 | d8")
                .attributeData("ATTRIBUTE_E", "e1 | e2 | e3 | e4 | e5 | e6 | e7 | e8")
                .build();
        //@formatter:on
    }

    private DatasetSelection buildDatasetSelection1() {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 21).dimensionValues("INDICE_OCUPACION_PLAZAS")         // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_C", null)                  // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", null)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();
        //@formatter:on
        return datasetSelection;
    }

    private DatasetSelection buildDatasetSelection2() {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 21, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();
        //@formatter:on
        return datasetSelection;
    }

    private DatasetSelection buildDatasetSelection3() {
        //@formatter:off
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS")
                .dimension("INDICADORES", 21, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .build();
        //@formatter:on
        return datasetSelection;
    }

    private BufferedReader createBufferedReader(File file) throws Exception {
        return createBufferedReader(file, "UTF8");
    }

    private BufferedReader createBufferedReader(File file, String encoding) throws Exception {
        return new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
    }

    private void resetMocks() {
        mockSrmRestExternalFacade();
    }

    private void mockSrmRestExternalFacade() {
        Mockito.when(srmRestExternalFacade.retrieveConceptByUrn(Mockito.any(String.class))).thenAnswer(new Answer<Concept>() {

            @Override
            public Concept answer(InvocationOnMock invocation) throws Throwable {
                Concept concept = new Concept();
                concept.setUrn((String) invocation.getArguments()[0]);
                Quantity a = new Quantity();
                a.setUnitMultiplier(100);
                concept.setQuantity(a);
                return concept;
            };
        });
    }

}