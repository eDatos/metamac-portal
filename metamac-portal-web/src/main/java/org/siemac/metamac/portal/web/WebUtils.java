package org.siemac.metamac.portal.web;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;
import java.util.StringJoiner;

import org.apache.commons.lang.StringUtils;
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
    private static final String SERVICE_CUSTOM                    = "custom";

    private static final String PARAM_BREADCRUMBS                 = "migas";
    private static final String PARAM_APP_NAME                    = "appName";
    private static final String PARAM_APP_URL                     = "appUrl";
    private static final String PARAM_ENABLE_AUTHENTICATION       = "enableAuthentication";
    private static final String PARAM_INSTALLATION_TYPE           = "installationType";

    private static final Logger log                               = LoggerFactory.getLogger(WebUtils.class);

    protected static String     installationType                  = null;
    protected static String     portalBaseUrl                     = null;
    protected static String     portalWebVisualizerUrl            = null;
    protected static String     statisticalVisualizerBaseUrl      = null;
    protected static String     statisticalResourcesApiBaseUrl    = null;
    protected static String     srmApiBaseUrl                     = null;
    protected static String     captchaExternalApiUrlBase         = null;
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
    protected static Boolean    portalGraphColorsEnabled          = false;
    protected static String     analyticsGoogleTrackingId         = null;
    protected static String     helpUrl                           = null;
    private static Integer      cellThreshold                     = null;
    protected static String     unitMeasure                       = null;
    protected static String     unitMeasureMultiplier             = null;
    protected static String     apiKey                            = null;
    protected static String     widgetApiKey                      = null;
    protected static String     casServiceLoginUrl                = null;
    protected static String     casServerUrlPrefix                = null;
    protected static String     casSecurityTolerance              = null;
    protected static String     appStyleCssUrl                    = null;

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

    public static String getPortalWebVisualizerUrl() {
        return portalWebVisualizerUrl;
    }

    public static void setPortalWebVisualizerUrl(String portalWebVisualizerUrl) {
        WebUtils.portalWebVisualizerUrl = portalWebVisualizerUrl;
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

    public static String getCaptchaExternalApiUrlBase() {
        return captchaExternalApiUrlBase;
    }

    public static void setCaptchaExternalApiUrlBase(String captchaExternalApiUrlBase) {
        WebUtils.captchaExternalApiUrlBase = captchaExternalApiUrlBase;
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
    public static String getPortalStyleHeaderUrl(String organizationService, String lang, String theme) {
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
                return portalAgricultureStyleHeaderUrl + buildHeaderQuery(lang);
            case SERVICE_MEDIOAMBIENTE:
                return portalEnvironmentStyleHeaderUrl + buildHeaderQuery(lang);
            case SERVICE_TURISMO:
                return portalTourismStyleHeaderUrl + buildHeaderQuery(lang);
            case SERVICE_FUNCION_PUBLICA:
                return portalPublicServiceStyleHeaderUrl + buildHeaderQuery(lang);
            case SERVICE_IQUA:
                return portalCustomStyleBaseUrl + "/" + organizationService + "/header.html" + buildHeaderQuery(lang);
            case SERVICE_CUSTOM:
                return getPortalCustomBaseUrlForTheme(theme) + "/header.html" + buildHeaderQuery(lang);
            default:
                if (StringUtils.isNotBlank(theme)) {
                    return getPortalCustomBaseUrlForTheme(theme) + "/header.html" + buildHeaderQuery(lang);
                }
                return portalDefaultStyleHeaderUrl + buildHeaderQuery(lang);
        }
    }

    public static String getPortalStyleFooterUrl(String organizationService, String theme) {
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
            case SERVICE_CUSTOM:
                return getPortalCustomBaseUrlForTheme(theme) + "/footer.html";
            default:
                if (StringUtils.isNotBlank(theme)) {
                    return getPortalCustomBaseUrlForTheme(theme) + "/footer.html";
                }
                return portalDefaultStyleFooterUrl;
        }
    }

    public static String getPortalStyleCssUrl(String organizationService, String theme) {
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
            case SERVICE_CUSTOM:
                return getPortalCustomBaseUrlForTheme(theme) + "/styles.css";
            default:
                if (StringUtils.isNotBlank(theme)) {
                    return getPortalCustomBaseUrlForTheme(theme) + "/styles.css";
                }
                return portalDefaultStyleCssUrl;
        }
    }

    public static boolean getShowRightsHolder(String organizationService, String theme) {
        switch (organizationService) {
            case SERVICE_CUSTOM:
            case SERVICE_AGRICULTURA:
            case SERVICE_MEDIOAMBIENTE:
            case SERVICE_TURISMO:
            case SERVICE_FUNCION_PUBLICA:
            case SERVICE_IQUA:
                return true;
            default:
                return StringUtils.isNotBlank(theme);
        }
    }

    private static String getPortalCustomBaseUrlForTheme(String theme) {
        final String organisation = theme.split("/")[0];
        final String service = theme.split("/")[1];
        return portalCustomStyleBaseUrl + "/../../" + organisation + "/portal/" + service;
    }

    public static String getThemeFromOrganisationService(String organizationService) {
        String baseUrl = "";
        switch (organizationService) {
            case SERVICE_AGRICULTURA:
                baseUrl = portalAgricultureStyleHeaderUrl;
                break;
            case SERVICE_MEDIOAMBIENTE:
                baseUrl = portalEnvironmentStyleHeaderUrl;
                break;
            case SERVICE_TURISMO:
                baseUrl = portalTourismStyleHeaderUrl;
                break;
            case SERVICE_FUNCION_PUBLICA:
                baseUrl = portalPublicServiceStyleHeaderUrl;
                break;
            case SERVICE_IQUA:
                baseUrl = portalCustomStyleBaseUrl + "/" + organizationService;
                break;
            default:
                return null;
        }

        ArrayList<String> baseUrlPathList = new ArrayList<>(Arrays.asList(baseUrl.split("/")));
        int portalIndex = baseUrlPathList.indexOf("portal");
        return baseUrlPathList.get(portalIndex - 1) + "/" + baseUrlPathList.get(portalIndex + 1);
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

    public static void setCellThreshold(Integer cellThreshold) {
        WebUtils.cellThreshold = cellThreshold;
    }

    public static Integer getCellThreshold() {
        return cellThreshold;
    }

    public static String getUnitMeasure() {
        return unitMeasure;
    }

    public static void setUnitMeasure(String unitMeasure) {
        WebUtils.unitMeasure = unitMeasure;
    }

    public static String getUnitMeasureMultiplier() {
        return unitMeasureMultiplier;
    }

    public static void setUnitMeasureMultiplier(String unitMeasureMultiplier) {
        WebUtils.unitMeasureMultiplier = unitMeasureMultiplier;
    }

    public static String getApiKey() {
        return apiKey;
    }

    public static void setApiKey(String apiKey) {
        WebUtils.apiKey = apiKey;
    }

    public static String getWidgetApiKey() {
        return widgetApiKey;
    }

    public static void setWidgetApiKey(String widgetApiKey) {
        WebUtils.widgetApiKey = widgetApiKey;
    }

    public static String getCasServiceLoginUrl() {
        return casServiceLoginUrl;
    }

    public static void setCasServiceLoginUrl(String casServiceLoginUrl) {
        WebUtils.casServiceLoginUrl = casServiceLoginUrl;
    }

    public static String getCasServerUrlPrefix() {
        return casServerUrlPrefix;
    }

    public static void setCasServerUrlPrefix(String casServerUrlPrefix) {
        WebUtils.casServerUrlPrefix = casServerUrlPrefix;
    }

    public static String getCasSecurityTolerance() {
        return casSecurityTolerance;
    }

    public static void setCasSecurityTolerance(String casSecurityTolerance) {
        WebUtils.casSecurityTolerance = casSecurityTolerance;
    }

    public static String getAppStyleCssUrl() {
        return appStyleCssUrl;
    }

    public static void setAppStyleCssUrl(String appStyleCssUrl) {
        WebUtils.appStyleCssUrl = appStyleCssUrl;
    }

    public static String buildPageTitle(String organisation, String resourceName, String lang) {
        StringJoiner joiner = new StringJoiner(" | ");
        joiner.add(organisation);
        if (!resourceName.isEmpty()) {
            joiner.add(resourceName);
        }
        joiner.add(getAppName(lang));
        return joiner.toString();
    }

    private static String buildParam(String param, String value) {
        try {
            return param + "=" + URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException encoding a constant. This is not supposed to EVER throw", e);
            return "";
        }
    }

    private static String buildQuery(String... params) {
        StringJoiner joiner = new StringJoiner("&");
        for (String param : params) {
            if (StringUtils.isNotBlank(param)) {
                joiner.add(param);
            }
        }
        return joiner.length() > 0 ? "?" + joiner.toString() : "";
    }

    private static String buildHeaderQuery(String lang) {
        return buildQuery(buildBreadcrumbsParams(lang), buildAppNameParam(lang), buildAppUrlParam(), buildInstallationType(), PARAM_ENABLE_AUTHENTICATION);
    }

    private static String buildInstallationType() {
        return buildParam(PARAM_INSTALLATION_TYPE, installationType);
    }

    private static String buildAppUrlParam() {
        return buildParam(PARAM_APP_URL, "");
    }

    private static String buildAppNameParam(String lang) {
        return buildParam(PARAM_APP_NAME, getAppName(lang));
    }

    private static String getAppName(String lang) {
        Locale locale = LocaleUtil.getLocaleFromLocaleString(lang);
        return LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_VISUALIZER, locale);
    }

    private static String buildBreadcrumbsParams(String lang) {
        return buildParam(PARAM_BREADCRUMBS, getAppName(lang));
    }

}
