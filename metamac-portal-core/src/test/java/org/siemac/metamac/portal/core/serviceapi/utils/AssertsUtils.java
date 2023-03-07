package org.siemac.metamac.portal.core.serviceapi.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.util.Iterator;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class AssertsUtils {

    public static String[][] readExcelContent(File tmpFile) throws IOException {
        FileInputStream file = new FileInputStream(tmpFile);
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        XSSFSheet sheet = workbook.getSheetAt(0);

        int rows = sheet.getPhysicalNumberOfRows();
        int columns = sheet.iterator().next().getLastCellNum();

        String[][] result = new String[rows][columns];

        Iterator<Row> rowIterator = sheet.iterator();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();
            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();
                String value;
                if (cell.getCellType() == CellType.STRING) {
                    value = cell.getStringCellValue();
                } else if (cell.getCellType() == CellType.BLANK) {
                    value = StringUtils.EMPTY;
                } else {
                    value = StringUtils.EMPTY + cell.getNumericCellValue();
                }
                result[row.getRowNum()][cell.getColumnIndex()] = value;
            }
        }
        return result;
    }

    public static byte[] createExcelContentHash(InputStream inputStream) throws Exception {
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        XSSFSheet sheet = workbook.getSheetAt(0);

        Iterator<Row> rowIterator = sheet.iterator();
        StringBuilder stringBuilder = new StringBuilder(2048);
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();
            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();
                String value;
                if (cell.getCellType() == CellType.STRING) {
                    value = cell.getStringCellValue();
                } else if (cell.getCellType() == CellType.BLANK) {
                    value = StringUtils.EMPTY;
                } else {
                    value = StringUtils.EMPTY + cell.getNumericCellValue();
                }
                stringBuilder.append(value);
            }
        }

        byte[] buffer = stringBuilder.toString().getBytes();

        MessageDigest complete = MessageDigest.getInstance("MD5");
        return complete.digest(buffer);
    }

    public static byte[] createExcelContentHash(File tmpFile) throws Exception {
        FileInputStream file = new FileInputStream(tmpFile);
        return createExcelContentHash(file);
    }

    public static byte[] createPlainTextContentHash(InputStream file) throws Exception {

        byte[] buffer = new byte[2048];
        IOUtils.readFully(file, buffer);

        MessageDigest complete = MessageDigest.getInstance("MD5");
        return complete.digest(buffer);
    }

    public static byte[] createPlainTextContentHash(File tmpFile) throws Exception {
        FileInputStream file = new FileInputStream(tmpFile);
        return createPlainTextContentHash(file);
    }

    public static byte[] createPxContentHash(InputStream file) throws Exception {

        byte[] buffer = new byte[256];
        IOUtils.readFully(file, buffer);

        MessageDigest complete = MessageDigest.getInstance("MD5");
        return complete.digest(buffer);
    }

    public static byte[] createPxContentHash(File tmpFile) throws Exception {
        FileInputStream file = new FileInputStream(tmpFile);
        return createPxContentHash(file);
    }

}
