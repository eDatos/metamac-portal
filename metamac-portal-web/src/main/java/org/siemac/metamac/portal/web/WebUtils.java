package org.siemac.metamac.portal.web;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import org.siemac.edatos.core.common.lang.LocaleUtil;
import org.siemac.metamac.portal.core.messages.MessageKeyType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebUtils extends org.siemac.metamac.core.common.util.WebUtils {

    private static final Logger log                               = LoggerFactory.getLogger(WebUtils.class);

    protected static String     exportApiBaseUrl                  = null;
    protected static String     permalinksApiBaseUrl              = null;

    protected static String     portalDefaultStyleHeaderUrl       = null;
    protected static String     portalDefaultStyleCssUrl          = null;
    protected static String     portalDefaultStyleFooterUrl       = null;

    protected static String     portalAgricultureStyleHeaderUrl   = null;
    protected static String     portalAgricultureStyleCssUrl      = null;
    protected static String     portalAgricultureStyleFooterUrl   = null;

    protected static String     portalEnvironmentStyleHeaderUrl   = null;
    protected static String     portalEnvironmentStyleCssUrl      = null;
    protected static String     portalEnvironmentStyleFooterUrl   = null;

    protected static String     portalTourismStyleHeaderUrl       = null;
    protected static String     portalTourismStyleCssUrl          = null;
    protected static String     portalTourismStyleFooterUrl       = null;

    protected static String     portalPublicServiceStyleHeaderUrl = null;
    protected static String     portalPublicServiceStyleCssUrl    = null;
    protected static String     portalPublicServiceStyleFooterUrl = null;

    protected static String     portalCustomStyleBaseUrl          = null;

    public static void setExportApiBaseURL(String exportApiBaseUrl) {
        WebUtils.exportApiBaseUrl = exportApiBaseUrl;
    }

    public static String getExportApiBaseURL() throws MalformedURLException {
        return normalizeUrl(exportApiBaseUrl);
    }

    public static void setPermalinksApiBaseURL(String permalinksApiBaseUrl) {
        WebUtils.permalinksApiBaseUrl = permalinksApiBaseUrl;
    }

    public static String getPermalinksApiBaseURL() throws MalformedURLException {
        return normalizeUrl(permalinksApiBaseUrl);
    }

    /* Portal specific. See web.xml for matched patterns */
    public static String getPortalStyleHeaderUrl(String organizationService, String lang) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleHeaderUrl + getBreadcrumbsParams(lang);
            case "medioambiente":
                return portalEnvironmentStyleHeaderUrl + getBreadcrumbsParams(lang);
            case "turismo":
                return portalTourismStyleHeaderUrl + getBreadcrumbsParams(lang);
            case "funcion-publica":
                return portalPublicServiceStyleHeaderUrl + getBreadcrumbsParams(lang);
            case "iqua":
                return portalCustomStyleBaseUrl + "/" + organizationService + "/header.html";
            default:
                return portalDefaultStyleHeaderUrl + getBreadcrumbsParams(lang);
        }
    }

    public static String getPortalStyleFooterUrl(String organizationService) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleFooterUrl;
            case "medioambiente":
                return portalEnvironmentStyleFooterUrl;
            case "turismo":
                return portalTourismStyleFooterUrl;
            case "funcion-publica":
                return portalPublicServiceStyleFooterUrl;
            case "iqua":
                return portalCustomStyleBaseUrl + "/" + organizationService + "/footer.html";
            default:
                return portalDefaultStyleFooterUrl;
        }
    }

    public static String getPortalStyleCssUrl(String organizationService) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleCssUrl;
            case "medioambiente":
                return portalEnvironmentStyleCssUrl;
            case "turismo":
                return portalTourismStyleCssUrl;
            case "funcion-publica":
                return portalPublicServiceStyleCssUrl;
            case "iqua":
                return portalCustomStyleBaseUrl + "/" + organizationService + "/styles.css";
            default:
                return portalDefaultStyleCssUrl;
        }
    }

    public static boolean getShowRightsHolder(String organizationService) {
        switch (organizationService) {
            case "agricultura":
            case "medioambiente":
            case "turismo":
            case "public-service":
            case "iqua":
                return true;
            default:
                return false;
        }
    }

    public static void setPortalDefaultStyleHeaderUrl(String portalDefaultStyleHeaderUrl) {
        WebUtils.portalDefaultStyleHeaderUrl = portalDefaultStyleHeaderUrl;
    }

    public static void setPortalDefaultStyleCssUrl(String portalDefaultStyleCssUrl) {
        WebUtils.portalDefaultStyleCssUrl = portalDefaultStyleCssUrl;
    }

    public static void setPortalDefaultStyleFooterUrl(String portalDefaultStyleFooterUrl) {
        WebUtils.portalDefaultStyleFooterUrl = portalDefaultStyleFooterUrl;
    }

    public static void setPortalAgricultureStyleHeaderUrl(String portalAgricultureStyleHeaderUrl) {
        WebUtils.portalAgricultureStyleHeaderUrl = portalAgricultureStyleHeaderUrl;
    }

    public static void setPortalAgricultureStyleCssUrl(String portalAgricultureStyleCssUrl) {
        WebUtils.portalAgricultureStyleCssUrl = portalAgricultureStyleCssUrl;
    }

    public static void setPortalAgricultureStyleFooterUrl(String portalAgricultureStyleFooterUrl) {
        WebUtils.portalAgricultureStyleFooterUrl = portalAgricultureStyleFooterUrl;
    }

    public static void setPortalEnvironmentStyleHeaderUrl(String portalEnvironmentStyleHeaderUrl) {
        WebUtils.portalEnvironmentStyleHeaderUrl = portalEnvironmentStyleHeaderUrl;
    }

    public static void setPortalEnvironmentStyleCssUrl(String portalEnvironmentStyleCssUrl) {
        WebUtils.portalEnvironmentStyleCssUrl = portalEnvironmentStyleCssUrl;
    }

    public static void setPortalEnvironmentStyleFooterUrl(String portalEnvironmentStyleFooterUrl) {
        WebUtils.portalEnvironmentStyleFooterUrl = portalEnvironmentStyleFooterUrl;
    }

    public static void setPortalTourismStyleHeaderUrl(String portalTourismStyleHeaderUrl) {
        WebUtils.portalTourismStyleHeaderUrl = portalTourismStyleHeaderUrl;
    }

    public static void setPortalTourismStyleCssUrl(String portalTourismStyleCssUrl) {
        WebUtils.portalTourismStyleCssUrl = portalTourismStyleCssUrl;
    }

    public static void setPortalTourismStyleFooterUrl(String portalTourismStyleFooterUrl) {
        WebUtils.portalTourismStyleFooterUrl = portalTourismStyleFooterUrl;
    }

    public static void setPortalPublicServiceStyleHeaderUrl(String portalPublicServiceStyleHeaderUrl) {
        WebUtils.portalPublicServiceStyleHeaderUrl = portalPublicServiceStyleHeaderUrl;
    }

    public static void setPortalPublicServiceStyleCssUrl(String portalPublicServiceStyleCssUrl) {
        WebUtils.portalPublicServiceStyleCssUrl = portalPublicServiceStyleCssUrl;
    }

    public static void setPortalPublicServiceStyleFooterUrl(String portalPublicServiceStyleFooterUrl) {
        WebUtils.portalPublicServiceStyleFooterUrl = portalPublicServiceStyleFooterUrl;
    }

    public static void setPortalCustomStyleBaseUrl(String portalCustomStyleBaseUrl) {
        WebUtils.portalCustomStyleBaseUrl = portalCustomStyleBaseUrl;
    }

    private static String getBreadcrumbsParams(String lang) {
        try {
            Locale locale = LocaleUtil.getLocaleFromLocaleString(lang);
            String homeTranslation = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_HOME, locale);
            String visualizerTranslation = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_VISUALIZER, locale);
            // IDEA: EDATOS-3159 move http://www.gobiernodecanarias.org to property
            return "?enlace=http://www.gobiernodecanarias.org/istac&miga=" + URLEncoder.encode(homeTranslation + "|" + visualizerTranslation, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException encoding a constant. This is not supposed to EVER throw", e);
            return "";
        }
    }

}
