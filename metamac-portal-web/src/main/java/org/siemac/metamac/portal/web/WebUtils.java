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

    private static final String SERVICE_AGRICULTURA               = "agricultura";
    private static final String SERVICE_MEDIOAMBIENTE             = "medioambiente";
    private static final String SERVICE_TURISMO                   = "turismo";
    private static final String SERVICE_FUNCION_PUBLICA           = "funcion-publica";
    private static final String SERVICE_IQUA                      = "iqua";

    private static final Logger log                               = LoggerFactory.getLogger(WebUtils.class);

    protected static String     installationType                  = null;
    protected static String     portalBaseUrl                     = null;
    protected static String     statisticalVisualizerBaseUrl      = null;
    protected static String     statisticalResourcesApiBaseUrl    = null;
    protected static String     srmApiBaseUrl                     = null;
    protected static String     permalinksApiBaseUrl              = null;
    protected static String     exportApiBaseUrl                  = null;
    protected static String     indicatorsApiBaseUrl              = null;

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

    protected static String     organisationUrn                   = null;
    protected static String     geographicalGranularityUrn        = null;
    protected static String     portalCustomStyleBaseUrl          = null;
    protected static String     socialTwitterVia                  = null;
    protected static Boolean    portalGraphColorsEnabled          = null;
    protected static String     analyticsGoogleTrackingId         = null;
    protected static String     helpUrl                           = null;

    public static String getInstallationType() {
        return installationType;
    }

    public static void setInstallationType(String installationType) {
        WebUtils.installationType = installationType;
    }

    public static String getPortalBaseUrl() {
        return portalBaseUrl;
    }

    public static void setPortalBaseUrl(String portalBaseUrl) {
        WebUtils.portalBaseUrl = portalBaseUrl;
    }

    public static String getStatisticalVisualizerBaseUrl() {
        return statisticalVisualizerBaseUrl;
    }

    public static void setStatisticalVisualizerBaseUrl(String statisticalVisualizerBaseUrl) {
        WebUtils.statisticalVisualizerBaseUrl = statisticalVisualizerBaseUrl;
    }

    public static String getStatisticalResourcesApiBaseUrl() {
        return statisticalResourcesApiBaseUrl;
    }

    public static void setStatisticalResourcesApiBaseUrl(String statisticalResourcesApiBaseUrl) {
        WebUtils.statisticalResourcesApiBaseUrl = statisticalResourcesApiBaseUrl;
    }

    public static String getSrmApiBaseUrl() {
        return srmApiBaseUrl;
    }

    public static void setSrmApiBaseUrl(String srmApiBaseUrl) {
        WebUtils.srmApiBaseUrl = srmApiBaseUrl;
    }

    public static String getPermalinksApiBaseUrl() {
        return permalinksApiBaseUrl;
    }

    public static void setPermalinksApiBaseUrl(String permalinksApiBaseUrl) {
        WebUtils.permalinksApiBaseUrl = permalinksApiBaseUrl;
    }

    public static String getExportApiBaseUrl() {
        return exportApiBaseUrl;
    }

    public static void setExportApiBaseUrl(String exportApiBaseUrl) {
        WebUtils.exportApiBaseUrl = exportApiBaseUrl;
    }

    public static String getIndicatorsApiBaseUrl() {
        return indicatorsApiBaseUrl;
    }

    public static void setIndicatorsApiBaseUrl(String indicatorsApiBaseUrl) {
        WebUtils.indicatorsApiBaseUrl = indicatorsApiBaseUrl;
    }

    public static String getOrganisationUrn() {
        return organisationUrn;
    }

    public static void setOrganisationUrn(String organisationUrn) {
        WebUtils.organisationUrn = organisationUrn;
    }

    public static String getGeographicalGranularityUrn() {
        return geographicalGranularityUrn;
    }

    public static void setGeographicalGranularityUrn(String geographicalGranularityUrn) {
        WebUtils.geographicalGranularityUrn = geographicalGranularityUrn;
    }

    public static String getAnalyticsGoogleTrackingId() {
        return analyticsGoogleTrackingId;
    }

    public static void setAnalyticsGoogleTrackingId(String analyticsGoogleTrackingId) {
        WebUtils.analyticsGoogleTrackingId = analyticsGoogleTrackingId;
    }
/* Portal specific. See web.xml for matched patterns */
    public static String getPortalStyleHeaderUrl(String organizationService, String lang) {
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
                return portalAgricultureStyleHeaderUrl + getBreadcrumbsParams(lang);
            case SERVICE_MEDIOAMBIENTE:
                return portalEnvironmentStyleHeaderUrl + getBreadcrumbsParams(lang);
            case SERVICE_TURISMO:
                return portalTourismStyleHeaderUrl + getBreadcrumbsParams(lang);
            case SERVICE_FUNCION_PUBLICA:
                return portalPublicServiceStyleHeaderUrl + getBreadcrumbsParams(lang);
            case SERVICE_IQUA:
                return portalCustomStyleBaseUrl + "/" + organizationService + "/header.html";
            default:
                return portalDefaultStyleHeaderUrl + getBreadcrumbsParams(lang);
        }
    }

    public static String getPortalStyleFooterUrl(String organizationService) {
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
                return portalAgricultureStyleFooterUrl;
            case SERVICE_MEDIOAMBIENTE:
                return portalEnvironmentStyleFooterUrl;
            case SERVICE_TURISMO:
                return portalTourismStyleFooterUrl;
            case SERVICE_FUNCION_PUBLICA:
                return portalPublicServiceStyleFooterUrl;
            case SERVICE_IQUA:
                return portalCustomStyleBaseUrl + "/" + organizationService + "/footer.html";
            default:
                return portalDefaultStyleFooterUrl;
        }
    }

    public static String getPortalStyleCssUrl(String organizationService) {
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
                return portalAgricultureStyleCssUrl;
            case SERVICE_MEDIOAMBIENTE:
                return portalEnvironmentStyleCssUrl;
            case SERVICE_TURISMO:
                return portalTourismStyleCssUrl;
            case SERVICE_FUNCION_PUBLICA:
                return portalPublicServiceStyleCssUrl;
            case SERVICE_IQUA:
                return portalCustomStyleBaseUrl + "/" + organizationService + "/styles.css";
            default:
                return portalDefaultStyleCssUrl;
        }
    }

    public static boolean getShowRightsHolder(String organizationService) {
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
            case SERVICE_MEDIOAMBIENTE:
            case SERVICE_TURISMO:
            case SERVICE_FUNCION_PUBLICA:
            case SERVICE_IQUA:
                return true;
            default:
                return false;
        }
    }

    public static String getHelpUrl() {
        return helpUrl;
    }

    public static String getSocialTwitterVia() {
        return socialTwitterVia;
    }

    public static boolean getPortalGraphColorsEnabled() {
        return portalGraphColorsEnabled;
    }

    public static void setPortalGraphColorsEnabled(boolean portalGraphColorsEnabled) {
        WebUtils.portalGraphColorsEnabled = portalGraphColorsEnabled;
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

    public static void setSocialTwitterVia(String socialTwitterVia) {
        WebUtils.socialTwitterVia = socialTwitterVia;
    }

    public static void setHelpUrl(String helpUrl) {
        WebUtils.helpUrl = helpUrl;
    }

    private static String getBreadcrumbsParams(String lang) {
        try {
            Locale locale = LocaleUtil.getLocaleFromLocaleString(lang);
            String visualizerTranslation = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_VISUALIZER, locale);
            return "?migas=" + URLEncoder.encode(visualizerTranslation, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException encoding a constant. This is not supposed to EVER throw", e);
            return "";
        }
    }

}
