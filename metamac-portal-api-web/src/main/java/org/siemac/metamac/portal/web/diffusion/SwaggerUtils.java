package org.siemac.metamac.portal.web.diffusion;

import java.net.MalformedURLException;

public class SwaggerUtils extends org.siemac.metamac.core.common.util.swagger.SwaggerUtils {

    protected static String currentApiName = null;

    private SwaggerUtils() {
    }

    public static String getExportApiBaseURLForSwagger() throws MalformedURLException {
        return normalizeUrlForSwagger(WebUtils.exportApiBaseUrl);
    }

    public static String getPermalinksApiBaseURLForSwagger() throws MalformedURLException {
        return normalizeUrlForSwagger(WebUtils.permalinksApiBaseUrl);
    }

    public static String formatJSONInsideDescription(String json) {

        return "<pre>" + json.replace("\"", "\\\"").replace("\n", "</br>").replace(" ", "&nbsp;") + "</pre>";
    }

    public static void setCurrentApi(String currentApi) {
        currentApiName = currentApi;
    }

    public static String getCurrentApi() {
        return currentApiName;
    }

}
