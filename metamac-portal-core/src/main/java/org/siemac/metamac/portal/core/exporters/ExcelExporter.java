package org.siemac.metamac.portal.core.exporters;

import java.io.IOException;
import java.io.OutputStream;
import java.text.DateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.siemac.edatos.core.common.lang.LocaleUtil;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.CellCommentDetails;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.ResourceAccess;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.invocation.SrmRestExternalFacade;
import org.siemac.metamac.portal.core.messages.MessageKeyType;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Contact;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Organisation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExcelExporter {

    private static final int       ROW_ACCESS_WINDOW_SIZE         = 100;

    private static final XSSFColor COLOR_WHITE                    = getXSSFColor("FFFFFF");
    private static final XSSFColor COLOR_BLACK                    = getXSSFColor("000000");

    private final ResourceAccess   resourceAccess;
    private final DatasetSelection datasetSelection;
    private Sheet                  sheet;

    private int                    rowsOfData;
    private int                    columnsOfData;
    private int                    leftHeaderSizeOfData;

    private int                    currentRowCount                = 0;
    private SXSSFWorkbook          workbook;
    private CreationHelper         creationHelper;
    private int                    maxRightColumnIndexWithContent = 0;

    private static Logger          log                            = LoggerFactory.getLogger(ExcelExporter.class);

    private CellStyle              dataCellStyle;
    private CellStyle              headerCellStyle;

    public ExcelExporter(SrmRestExternalFacade srmRestExternalFacade, Dataset dataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        resourceAccess = new ResourceAccess(srmRestExternalFacade, dataset, datasetSelection, lang, langAlternative);
        this.datasetSelection = datasetSelection;
    }

    public ExcelExporter(SrmRestExternalFacade srmRestExternalFacade, Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String lang, String langAlternative)
            throws MetamacException {
        resourceAccess = new ResourceAccess(srmRestExternalFacade, query, relatedDataset, datasetSelection, lang, langAlternative);
        this.datasetSelection = datasetSelection;
    }

    private void initialize() {
        workbook = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
        sheet = workbook.createSheet();
        rowsOfData = datasetSelection.getRows();
        columnsOfData = datasetSelection.getColumns();
        leftHeaderSizeOfData = datasetSelection.getLeftDimensions().size();
        creationHelper = workbook.getCreationHelper();

        headerCellStyle = createStyleSolid(COLOR_BLACK, COLOR_WHITE, true);
        dataCellStyle = createStyleSolid(COLOR_BLACK, null, null);
        addBorderToCellStyle(dataCellStyle);
    }

    private void header() {
        int headerRow = 0;
        Locale locale = LocaleUtil.getLocaleFromLocaleString(resourceAccess.getLang());

        // Title
        String title = PortalUtils.getLabel(resourceAccess.getName(), resourceAccess.getLang(), resourceAccess.getLangAlternative());
        if (!StringUtils.isEmpty(title)) {
            Row rowTitle = sheet.createRow(headerRow++);
            addStringCell(rowTitle, 0, title, headerCellStyle);
            sheet.addMergedRegion(new CellRangeAddress(headerRow - 1, headerRow - 1, 0, 4));
        }

        // Subject area
        Resources subjectAreas = resourceAccess.getMetadata().getSubjectAreas();
        StringBuilder valueName = new StringBuilder();
        if (subjectAreas != null) {
            Iterator<Resource> iterator = subjectAreas.getResources().iterator();
            while (iterator.hasNext()) {
                Resource subjectArea = iterator.next();
                valueName.append(PortalUtils.getLabel(subjectArea.getName(), resourceAccess.getLang(), resourceAccess.getLangAlternative()));
                if (iterator.hasNext()) {
                    valueName.append("; ");
                }
            }
        }

        if (valueName.length() > 0) {
            Row rowSubjectArea = sheet.createRow(headerRow++);
            addStringCell(rowSubjectArea, 0, valueName.toString(), headerCellStyle);
            sheet.addMergedRegion(new CellRangeAddress(headerRow - 1, headerRow - 1, 0, 4));
        }

        headerRow++; // Blank row

        // Other
        // Rights Holder
        Organisation rightsHolder = resourceAccess.getMetadata().getRightsHolder();
        if (rightsHolder != null) {
            String rightsHolderLabel = PortalUtils.getLabel(rightsHolder.getName(), resourceAccess.getLang(), resourceAccess.getLangAlternative());

            Row row = sheet.createRow(headerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_RIGHTS_HOLDER, locale);
            addStringCell(row, 0, messageForCode, null);
            addStringCell(row, 1, rightsHolderLabel, null);
        }

        // Copyright date
        Integer copyrightDate = resourceAccess.getMetadata().getCopyrightDate();
        if (copyrightDate != null) {
            Row row = sheet.createRow(headerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_COPYRIGHT, locale);
            addStringCell(row, 0, messageForCode, null);
            addStringCell(row, 1, copyrightDate.toString(), null);
        }

        // Contacto del IBESTAT
        if (rightsHolder != null && rightsHolder.getContacts().getTotal().longValue() > 0) {
            Row rowHeader = sheet.createRow(headerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_CONTACTS, locale);
            addStringCell(rowHeader, 0, messageForCode, null);
            for (Contact contact : rightsHolder.getContacts().getContacts()) {
                Row row = sheet.createRow(headerRow++);
                addStringCell(row, 1, buildContactText(contact), null);
            }
        }

        // Last update date
        Date lastUpdateDate = resourceAccess.getMetadata().getLastUpdate();
        if (lastUpdateDate != null) {
            Row row = sheet.createRow(headerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_LAST_UPDATE, locale);
            addStringCell(row, 0, messageForCode, null);
            DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.MEDIUM, locale);
            addStringCell(row, 1, dateFormat.format(lastUpdateDate), null);
        }
        headerRow++; // Blank row

        // Fixed Dimensions
        StringBuilder fixedDimensionsText = new StringBuilder();
        for (DatasetSelectionDimension datasetSelectionDimension : datasetSelection.getFixedDimensions()) {
            String dimensionText = resourceAccess.applyLabelVisualizationModeForDimension(datasetSelectionDimension.getId());
            String dimensionValueText = resourceAccess.applyLabelVisualizationModeForDimensionValue(datasetSelectionDimension.getId(), datasetSelectionDimension.getSelectedDimensionValues().get(0));
            fixedDimensionsText.append(dimensionText).append(" = ").append(dimensionValueText).append(", ");

        }

        if (fixedDimensionsText.length() > 0) {
            fixedDimensionsText.delete(fixedDimensionsText.length() - 3, fixedDimensionsText.length()); // delete last comma and space
            String by = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_LABEL_PARA, locale);
            Row rowTitle = sheet.createRow(headerRow++);
            addStringCell(rowTitle, 0, by + " " + fixedDimensionsText.toString(), null);
            sheet.addMergedRegion(new CellRangeAddress(headerRow - 1, headerRow - 1, 0, 4));
            headerRow += 1;
        }

        headerRow++;

        currentRowCount = headerRow;
    }

    private String buildContactText(Contact contact) {
        StringBuilder contactBuilder = new StringBuilder();
        Locale locale = LocaleUtil.getLocaleFromLocaleString(resourceAccess.getLang());
        final String SEPARATOR_FIELD = ". ";
        final String SEPARATOR_LABEL = ": ";
        final String SEPARATOR_ITEM_LIST = ", ";

        // @formatter:off
        if (contact.getName() != null) {
            contactBuilder
                .append(PortalUtils.getLabel(contact.getName(), resourceAccess.getLang(), resourceAccess.getLangAlternative()))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getResponsibility() != null) {
            contactBuilder
                .append(PortalUtils.getLabel(contact.getResponsibility(), resourceAccess.getLang(), resourceAccess.getLangAlternative()))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getOrganisationUnit() != null) {
            contactBuilder
                .append(PortalUtils.getLabel(contact.getOrganisationUnit(), resourceAccess.getLang(), resourceAccess.getLangAlternative()))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getEmails().size() > 0) {
            contactBuilder
                .append(LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_CONTACTS_EMAILS, locale))
                .append(SEPARATOR_LABEL).append(StringUtils.join(contact.getEmails(), SEPARATOR_ITEM_LIST))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getTelephones().size() > 0) {
            contactBuilder
                .append(LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_CONTACTS_TELEPHONES, locale))
                .append(SEPARATOR_LABEL).append(StringUtils.join(contact.getTelephones(), SEPARATOR_ITEM_LIST))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getFaxes().size() > 0) {
            contactBuilder
                .append(LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_CONTACTS_FAXES, locale))
                .append(SEPARATOR_LABEL).append(StringUtils.join(contact.getFaxes(), SEPARATOR_ITEM_LIST))
                .append(SEPARATOR_FIELD);
        }

        if (contact.getUrls().size() > 0) {
            contactBuilder
                .append(StringUtils.join(contact.getUrls(), SEPARATOR_ITEM_LIST))
                .append(SEPARATOR_FIELD);
        }

        // @formatter:on

        return contactBuilder.toString();
    }

    private void contentHeader() {
        int headerRow = currentRowCount;
        for (DatasetSelectionDimension dimension : datasetSelection.getTopDimensions()) {
            Row row = sheet.createRow(headerRow);
            List<String> selectedDimensionValues = dimension.getSelectedDimensionValues();
            int headerColumn = leftHeaderSizeOfData;
            int multiplier = datasetSelection.getMultiplierForDimension(dimension);
            int repeat = columnsOfData / (multiplier * selectedDimensionValues.size());
            for (int i = 0; i < repeat; i++) {
                for (String selectedDimensionValue : selectedDimensionValues) {
                    String dimensionValueLabel = toDimensionValueLabel(dimension.getId(), selectedDimensionValue);

                    Cell cell = initializeCell(row, headerColumn);
                    cell.setCellValue(dimensionValueLabel);
                    cell.setCellType(CellType.STRING);
                    cell.setCellStyle(headerCellStyle);
                    headerColumn += multiplier;
                }
            }
            headerRow++;
        }
        currentRowCount = headerRow;
    }

    private void content() {
        int observationsStartRow = currentRowCount;
        for (int i = 0; i < rowsOfData; i++) {
            Row row = sheet.createRow(observationsStartRow + i);
            leftHeaderAtRow(i, row);
            observationsAtRow(i, row);
        }
        currentRowCount += rowsOfData;
    }

    private void footer() {
        currentRowCount += 2;
    }

    private void addStringCell(Row row, int column, String cellValue, CellStyle cellStyle) {
        Cell cell = initializeCell(row, column);
        cell.setCellValue(cellValue);
        cell.setCellType(CellType.STRING);
        cell.setCellStyle(cellStyle);
    }

    private void leftHeaderAtRow(int observationRowIndex, Row row) {
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
        for (int leftDimensionIndex = 0; leftDimensionIndex < leftDimensions.size(); leftDimensionIndex++) {
            DatasetSelectionDimension dimension = leftDimensions.get(leftDimensionIndex);
            String dimensionId = dimension.getId();
            int multiplier = datasetSelection.getMultiplierForDimension(dimension);
            if (observationRowIndex % multiplier == 0) {
                String dimensionValueId = dimension.getSelectedDimensionValues().get((observationRowIndex / multiplier) % dimension.getSelectedDimensionValues().size());
                String dimensionValueLabel = toDimensionValueLabel(dimensionId, dimensionValueId);

                Cell cell = initializeCell(row, leftDimensionIndex);
                cell.setCellValue(dimensionValueLabel);
                cell.setCellType(CellType.STRING);
                cell.setCellStyle(headerCellStyle);
            } else {
                // Empty Cells
                Cell cell = initializeCell(row, leftDimensionIndex);
                cell.setCellType(CellType.STRING);
                cell.setCellStyle(headerCellStyle);
            }
        }
    }

    private void observationsAtRow(int observationRowIndex, Row row) {
        for (int j = 0; j < columnsOfData; j++) {
            Map<String, String> permutationAtCell = datasetSelection.permutationAtCell(observationRowIndex, j);
            String observation = resourceAccess.observationAtPermutation(permutationAtCell);
            Cell cell = initializeCell(row, leftHeaderSizeOfData + j);

            addCellComment(resourceAccess.observationAttributesAtPermutation(permutationAtCell), cell);

            if (observation != null) {
                if (NumberUtils.isNumber(observation)) {
                    cell.setCellValue(NumberUtils.createDouble(observation));
                    cell.setCellType(CellType.NUMERIC);
                } else {
                    cell.setCellValue(observation);
                    cell.setCellType(CellType.STRING);
                }
            }
            cell.setCellStyle(dataCellStyle);
        }
    }

    private void addCellComment(CellCommentDetails cellCommentDetails, Cell cell) {
        String commentString = cellCommentDetails.getValue();
        if (commentString == null) {
            return;
        }

        // Create the comment
        Drawing drawing = sheet.createDrawingPatriarch();

        // When the comment box is visible, have it show in a box
        ClientAnchor anchor = creationHelper.createClientAnchor();
        anchor.setCol1(cell.getColumnIndex());

        anchor.setCol2(cell.getColumnIndex() + cellCommentDetails.calculateNumberOfColumnsToAccomodateComment());
        anchor.setRow1(cell.getRowIndex());
        anchor.setRow2(cell.getRowIndex() + cellCommentDetails.calculateNumberOfRowsToAccomodateComment());

        Comment comment = drawing.createCellComment(anchor);
        RichTextString str = creationHelper.createRichTextString(commentString);
        comment.setString(str);

        cell.setCellComment(comment);
    }

    private String toDimensionValueLabel(String dimensionId, String dimensionValueId) {
        LabelVisualisationModeEnum labelVisualisation = resourceAccess.getDimensionLabelVisualisationMode(dimensionId);
        String dimensionValueLabel = null;
        if (labelVisualisation.isLabel() && labelVisualisation.isCode()) {
            dimensionValueLabel = resourceAccess.getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId) + " (" + dimensionValueId + ")";
        } else if (labelVisualisation.isLabel()) {
            dimensionValueLabel = resourceAccess.getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId);
        } else if (labelVisualisation.isCode()) {
            dimensionValueLabel = dimensionValueId;
        }
        return dimensionValueLabel;
    }

    public void write(OutputStream os) throws MetamacException {
        initialize();
        header();
        contentHeader();
        content();
        footer();

        // Adjust column width
        for (int i = 0; i <= maxRightColumnIndexWithContent; i++) {
            sheet.setColumnWidth(i, 16 * 256); // 15 characters of width
        }

        try {
            workbook.write(os);
        } catch (IOException e) {
            log.error("Error writing excel to OutputStream", e);
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error writing excel to OutputStream");
        }
        workbook.dispose();
    }

    private static XSSFColor getXSSFColor(String RGB) {

        int red = Integer.parseInt(RGB.substring(0, 2), 16);
        int green = Integer.parseInt(RGB.substring(2, 4), 16);
        int blue = Integer.parseInt(RGB.substring(4, 6), 16);

        return new XSSFColor(new byte[]{(byte) red, (byte) green, (byte) blue});
    }

    /**
     * Create a cellStyle with solid foreground color and font color
     *
     * @param foregroundColor required
     * @param fontColor optional
     * @return
     */
    private CellStyle createStyleSolid(XSSFColor fontColor, XSSFColor foregroundColor, Boolean bold) {
        if (foregroundColor == null && fontColor == null) {
            return null;
        }

        CellStyle style = workbook.createCellStyle();

        // We work with XLSX -> SXSSFWorkbook
        XSSFCellStyle styleXSSF = (XSSFCellStyle) style;

        if (foregroundColor != null) {
            styleXSSF.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            styleXSSF.setFillForegroundColor(foregroundColor);
        }

        if (fontColor != null) {
            Font font = workbook.createFont();
            // We work with XLSX -> SXSSFWorkbook
            XSSFFont fontXSSF = (XSSFFont) font;
            fontXSSF.setColor(fontColor);
            if (bold != null) {
                fontXSSF.setBold(bold);
            }
            styleXSSF.setFont(fontXSSF);
        }

        return style;
    }

    private void addBorderToCellStyle(CellStyle cellStyle) {
        XSSFCellStyle styleXSSF = (XSSFCellStyle) cellStyle;
        styleXSSF.setBorderBottom(BorderStyle.THIN);
        styleXSSF.setBorderLeft(BorderStyle.THIN);
        styleXSSF.setBorderRight(BorderStyle.THIN);
        styleXSSF.setBorderTop(BorderStyle.THIN);
    }

    private Cell initializeCell(Row row, int headerColumn) {
        if (headerColumn > maxRightColumnIndexWithContent) {
            maxRightColumnIndexWithContent = headerColumn;
        }
        return row.createCell(headerColumn);
    }
}