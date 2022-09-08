package org.siemac.metamac.portal.rest.external.service.utils;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;

public class ExportUtils {

    /* We use the filename parameter and its extension if they exists. If not, we use the proper extension */
    public static String buildFilenameWithProposedExtension(String proposedExtension, String proposedFilename) {
        String filenamePrefix = FilenameUtils.getBaseName(proposedFilename);
        String extension = FilenameUtils.getExtension(proposedFilename);
        if (!StringUtils.isEmpty(extension)) {
            return proposedFilename;
        } else {
            return buildFilename("." + proposedExtension, filenamePrefix);
        }
    }

    public static String buildSafeFilenameWithoutExtension(String... parts) {
        StringBuilder filename = new StringBuilder();
        return filename.append(StringUtils.join(parts, "-")).toString().replace(".", "_");
    }

    public static String buildFilename(String extension, String... parts) {
        StringBuilder filename = new StringBuilder();
        return filename.append(StringUtils.join(parts, "-")).append(extension).toString();
    }

}
