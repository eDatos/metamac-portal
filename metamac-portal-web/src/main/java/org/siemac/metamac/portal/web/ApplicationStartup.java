package org.siemac.metamac.portal.web;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import org.jasig.cas.client.authentication.AuthenticationFilter;
import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.session.SingleSignOutHttpSessionListener;
import org.siemac.edatos.core.common.constants.shared.ConfigurationConstants;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.filter.CORSFilter;
import org.siemac.metamac.core.common.filter.URIEncodingFilter;
import org.siemac.metamac.core.common.listener.ApplicationStartupListener;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.siemac.metamac.portal.web.filter.CasAuthorizationFilter;
import org.siemac.metamac.portal.web.filter.CasValidationFilter;
import org.siemac.metamac.portal.web.filter.CookieRewritePathFilter;
import org.siemac.metamac.portal.web.filter.WidgetCasFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplicationStartup extends ApplicationStartupListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationStartup.class);

    private static final List<String> patternsProtectedByCas = new ArrayList<>();

    public static final List<String> COLLECTION_PATHS = Collections.unmodifiableList(Arrays.asList(
        "/visualizer/collection.html",
        "/visualizer/custom/collection.html",
        "/visualizer/agricultura/collection.html",
        "/visualizer/medioambiente/collection.html",
        "/visualizer/turismo/collection.html",
        "/visualizer/funcion-publica/collection.html",
        "/visualizer/iqua/collection.html"
    ));

    public static final List<String> DATA_PATHS = Collections.unmodifiableList(Arrays.asList(
        "/visualizer/data.html",
        "/visualizer/custom/data.html",
        "/visualizer/agricultura/data.html",
        "/visualizer/medioambiente/data.html",
        "/visualizer/turismo/data.html",
        "/visualizer/funcion-publica/data.html",
        "/visualizer/iqua/data.html"
    ));

    @Override
    public String projectName() {
        return "statistical-visualizer";
    }

    private PortalConfiguration portalConfigurationService;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            portalConfigurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
        } catch (Exception e) {
            // Abort startup application
            throw new RuntimeException(e);
        }
        super.contextInitialized(sce);

        // Initialize required properties
        try {
            String INSTALLATION_TYPE = portalConfigurationService.retrieveInstallationType();
            WebUtils.setInstallationType(INSTALLATION_TYPE);
            if (INSTALLATION_TYPE.equals("EXTERNAL")) {
                WebUtils.setPortalBaseUrl(configurationService.retrievePortalExternalWebApplicationUrlBase());
                WebUtils.setPortalWebVisualizerUrl(configurationService.retrievePortalExternalWebApplicationUrlVisualizer());

                WebUtils.setAppsBaseUrl(configurationService.retrieveAppsExternalWebApplicationUrlBase());
                WebUtils.setPermalinksApiBaseUrl(configurationService.retrievePortalExternalApisPermalinksUrlBase());
                WebUtils.setExportApiBaseUrl(configurationService.retrievePortalExternalApisExportUrlBase());
                WebUtils.setApiKey(configurationService.retrievePortalApiKey());
            } else if (INSTALLATION_TYPE.equals("INTERNAL")) {
                WebUtils.setPortalBaseUrl(portalConfigurationService.retrievePortalInternalWebApplicationUrlBase());
                WebUtils.setPortalWebVisualizerUrl(configurationService.retrievePortalInternalWebApplicationUrlVisualizer());

                WebUtils.setAppsBaseUrl(configurationService.retrieveAppsInternalWebApplicationUrlBase());
                WebUtils.setPermalinksApiBaseUrl(portalConfigurationService.retrievePortalInternalApisPermalinksUrlBase());
                WebUtils.setExportApiBaseUrl(portalConfigurationService.retrievePortalInternalApisExportUrlBase());
                WebUtils.setApiKey(portalConfigurationService.retrievePortalInternalApiKey());
                WebUtils.setCasServiceLoginUrl(portalConfigurationService.retrieveSecurityCasServiceLoginUrl());
                WebUtils.setCasServerUrlPrefix(configurationService.retrieveSecurityCasServerUrlPrefix());
                WebUtils.setCasSecurityTolerance(configurationService.retrieveSecurityTolerance());
            }
            WebUtils.setWidgetApiKey(portalConfigurationService.retrievePortalWidgetApiKeyByInstallationType());

            WebUtils.setApiStyleHeaderUrl(configurationService.retrieveApiStyleHeaderUrl());
            WebUtils.setApiStyleCssUrl(configurationService.retrieveApiStyleCssUrl());
            WebUtils.setApiStyleFooterUrl(configurationService.retrieveApiStyleFooterUrl());

            WebUtils.setPortalDefaultStyleHeaderUrl(portalConfigurationService.retrievePortalDefaultStyleHeaderUrl());
            WebUtils.setPortalDefaultStyleFooterUrl(portalConfigurationService.retrievePortalDefaultStyleFooterUrl());

            WebUtils.setStatisticalVisualizerBaseUrl(configurationService.retrievePortalExternalUrlBase());
            WebUtils.setStatisticalResourcesApiBaseUrl(configurationService.retrieveStatisticalResourcesExternalApiUrlBase());
            WebUtils.setSrmApiBaseUrl(configurationService.retrieveSrmExternalApiUrlBase());
            WebUtils.setIndicatorsApiBaseUrl(configurationService.retrieveIndicatorsExternalApiUrlBase());
            WebUtils.setOrganisationUrn(configurationService.retrieveOrganisationUrn());
            WebUtils.setGeographicalGranularityUrn(configurationService.retrieveDefaultCodelistGeographicalGranularityUrn());
            WebUtils.setAnalyticsGoogleTrackingId(configurationService.retrieveAnalyticsGoogleTrackingId());
            WebUtils.setCellThreshold(portalConfigurationService.retrieveExportExcelCellThreshold());
            WebUtils.setAppStyleCssUrl(portalConfigurationService.retrieveAppStyleCssUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application configuration", e);
        }

        // Initialize optional properties
        setPortalDefaultStyleCss();
        setPortalAgricultureStyles();
        setPortalEnvironmentStyles();
        setPortalTourismStyles();
        setPortalPublicServiceStyles();
        setPortalCustomStyles();
        setSocialTwitterVia();
        setPortalGraphColorsEnabled();
        setHelpUrl();
        setExternalUsersIntegration();
        setUnitMeasure();
        setUnitMeasureMultiplier();

        patternsProtectedByCas.add("/");
        registerServlets(sce);
        registerFilters(sce);
    }

    private void setExternalUsersIntegration() {
        try {
            WebUtils.setCaptchaExternalApiUrlBase(configurationService.retrieveCaptchaExternalApiUrlBase());
        } catch (MetamacException e) {
            log.debug("Error retrieving external users configuration", e);
        }
    }

    private void setPortalDefaultStyleCss() {
        try {
            WebUtils.setPortalDefaultStyleCssUrl(portalConfigurationService.retrievePortalDefaultStyleCssUrl());
        } catch (MetamacException e) {
            log.debug("Error retrieving application portal default style css url", e);
        }
    }

    private void setPortalGraphColorsEnabled() {
        try {
            WebUtils.setPortalGraphColorsEnabled(Boolean.parseBoolean(configurationService.retrievePortalGraphColorsEnabled()));
        } catch (MetamacException e) {
            log.debug("Error retrieving application portal colors enabled configuration", e);
        }
    }

    // IDEA we try do it more scalable without breaking the rest, but the idea is to use only this one in the future
    private void setPortalCustomStyles() {
        try {
            WebUtils.setPortalCustomStyleBaseUrl(portalConfigurationService.retrievePortalCustomStyleBaseUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application Agriculture configuration", e);
        }
    }

    private void setPortalAgricultureStyles() {
        try {
            WebUtils.setPortalAgricultureStyleHeaderUrl(portalConfigurationService.retrievePortalAgricultureStyleHeaderUrl());
            WebUtils.setPortalAgricultureStyleCssUrl(portalConfigurationService.retrievePortalAgricultureStyleCssUrl());
            WebUtils.setPortalAgricultureStyleFooterUrl(portalConfigurationService.retrievePortalAgricultureStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application Agriculture configuration", e);
        }
    }

    private void setPortalEnvironmentStyles() {
        try {
            WebUtils.setPortalEnvironmentStyleHeaderUrl(portalConfigurationService.retrievePortalEnvironmentStyleHeaderUrl());
            WebUtils.setPortalEnvironmentStyleCssUrl(portalConfigurationService.retrievePortalEnvironmentStyleCssUrl());
            WebUtils.setPortalEnvironmentStyleFooterUrl(portalConfigurationService.retrievePortalEnvironmentStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application Environment configuration", e);
        }
    }

    private void setPortalTourismStyles() {
        try {
            WebUtils.setPortalTourismStyleHeaderUrl(portalConfigurationService.retrievePortalTourismStyleHeaderUrl());
            WebUtils.setPortalTourismStyleCssUrl(portalConfigurationService.retrievePortalTourismStyleCssUrl());
            WebUtils.setPortalTourismStyleFooterUrl(portalConfigurationService.retrievePortalTourismStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application Tourism configuration", e);
        }
    }

    private void setPortalPublicServiceStyles() {
        try {
            WebUtils.setPortalPublicServiceStyleHeaderUrl(portalConfigurationService.retrievePortalPublicServiceStyleHeaderUrl());
            WebUtils.setPortalPublicServiceStyleCssUrl(portalConfigurationService.retrievePortalPublicServiceStyleCssUrl());
            WebUtils.setPortalPublicServiceStyleFooterUrl(portalConfigurationService.retrievePortalPublicServiceStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application Public Service configuration", e);
        }
    }

    private void setSocialTwitterVia() {
        try {
            WebUtils.setSocialTwitterVia(configurationService.retrieveSharedSocialTwitterVia());
        } catch (MetamacException e) {
            log.debug("Error retrieving application OPTIONAL Social Twitter Via", e);
        }
    }

    private void setHelpUrl() {
        try {
            WebUtils.setHelpUrl(configurationService.retrievePortalVisualizerHelpUrl());
        } catch (MetamacException e) {
            log.debug("Error retrieving application visualizer help url", e);
        }
    }

    private void setUnitMeasure() {
        try {
            WebUtils.setUnitMeasure(configurationService.retrieveUnitMeasure());
        } catch (MetamacException e) {
            log.debug("Error retrieving application unit measure property", e);
        }
    }

    private void setUnitMeasureMultiplier() {
        try {
            WebUtils.setUnitMeasureMultiplier(configurationService.retrieveUnitMeasureMultiplier());
        } catch (MetamacException e) {
            log.debug("Error retrieving application unit measure multiplier property", e);
        }
    }

    @Override
    public void checkApplicationProperties() throws MetamacException {
        // Datasource
        checkRequiredProperty(PortalConfigurationConstants.DB_DRIVER_NAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_URL);
        checkRequiredProperty(PortalConfigurationConstants.DB_USERNAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_PASSWORD);

        // Api
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_PORTAL_EXTERNAL_BASE);

        // Visualizer (also the api ones)
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_ORGANISATION);
        String INSTALLATION_TYPE = portalConfigurationService.retrieveInstallationType();

        if (INSTALLATION_TYPE.equals("EXTERNAL")) {
            // checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_EXTERNAL_API); // Already checked for metamac-portal-rest-external
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
        } else if (INSTALLATION_TYPE.equals("INTERNAL")) {
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_INTERNAL_API);
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_INTERNAL_API);
        }

        // Misc
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_EDITION_LANGUAGES);
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_ORGANISATION_URN);
        checkRequiredProperty(PortalConfigurationConstants.DEFAULT_CODELIST_GEOGRAPHICAL_GRANULARITY_URN);

        // Google analytics
        checkRequiredProperty(PortalConfigurationConstants.ANALYTICS_GOOGLE_TRACKING_ID);

        // Social
        checkOptionalProperty(ConfigurationConstants.SHARED_SOCIAL_TWITTER_VIA);

        // Visualizer
        checkOptionalProperty(ConfigurationConstants.PORTAL_GRAPH_COLORS_ENABLED);
        checkOptionalProperty(ConfigurationConstants.PORTAL_VISUALIZER_HELP_URL);

        // Styles
        checkOptionalProperty(ConfigurationConstants.PORTAL_DEFAULT_STYLE_CSS_URL);

        // Excel
        checkRequiredProperty(PortalConfigurationConstants.PORTAL_EXPORT_EXCEL_CELL_THRESHOLD);

        // App style
        checkRequiredProperty(PortalConfigurationConstants.APP_STYLE_CSS_URL);

        // Unit measure
        checkOptionalProperty(PortalConfigurationConstants.UNIT_MEASURE);
        checkOptionalProperty(PortalConfigurationConstants.UNIT_MEASURE_MULTIPLIER);

        // Captcha
        checkOptionalProperty(PortalConfigurationConstants.ENDPOINT_EXTERNAL_CAPTCHA_API);
    }

    private void registerServlets(ServletContextEvent sce) {
        log.info("Registering application servlets...");

        // PROTECTED BY CAS
        registerServlet(sce, "operations", "/jsp/visualizer/operations.jsp", true, "/visualizer/operations.html");
        registerServlet(sce, "data", "/jsp/visualizer/data.jsp", true, DATA_PATHS.toArray(new String[0]));
        registerServlet(sce, "collection", "/jsp/visualizer/collection.jsp", true, COLLECTION_PATHS.toArray(new String[0]));
        registerServlet(sce, "widget", "/jsp/widget.jsp", true, "/widget.html");
        registerServlet(sce, "403", "/jsp/visualizer/403.jsp", true, "/error/403.html");

        // UNPROTECTED BY CAS
        registerServlet(sce, "widget-js", "/js/widget.jsp", false, "/js/widget.js");
        registerServlet(sce, "widget-login-required", "/jsp/visualizer/widget-login-required.jsp", false, "/error/widget-login-required.html");

        log.info("All servlets registered successfully");
    }

    private void registerServlet(ServletContextEvent sce, String servletName, String jspPath, boolean protectedByCas, String... urlPatterns) {
        ServletRegistration.Dynamic servlet = sce.getServletContext().addServlet(servletName, new JspForwardServlet(jspPath));
        servlet.addMapping(urlPatterns);

        if (protectedByCas) {
            patternsProtectedByCas.addAll(Arrays.asList(urlPatterns));
            log.info("Registered servlet PROTECTED by CAS '{}' -> {} (patterns: {})", new Object[]{servletName, jspPath, Arrays.toString(urlPatterns)});
        } else {
            log.warn("Registered servlet NOT PROTECTED by CAS '{}' -> {} (patterns: {})", new Object[]{servletName, jspPath, Arrays.toString(urlPatterns)});
        }
    }

    private void registerFilters(ServletContextEvent sce) {
        registerFilter(sce, "CORSFilter", CORSFilter.class, null, "/apis/*");
        registerFilter(sce, "CookieRewritePathFilter", CookieRewritePathFilter.class, null, "/*");
        registerFilter(sce, "encodingFilter", URIEncodingFilter.class, new HashMap<String, String>() {{
            put("encodings", "UTF-8");
        }}, "/*");

        if ("INTERNAL".equals(WebUtils.getInstallationType())) {
            try {
                sce.getServletContext().addListener(SingleSignOutHttpSessionListener.class);

                registerCasFilter(sce, "Widget Cas Filter", WidgetCasFilter.class, null, "/widget.html");
                registerCasFilter(sce, "CAS Single Sign Out Filter", SingleSignOutFilter.class, null);
                registerCasFilter(sce, "Cas Validation Filter", CasValidationFilter.class, null);
                registerCasFilter(sce, "CAS Authentication Filter", AuthenticationFilter.class, new HashMap<String, String>() {{
                    put("casServerLoginUrl", WebUtils.getCasServiceLoginUrl());
                    put("serverName", getServerNameFromUrl(WebUtils.getPortalBaseUrl()));
                }});
                registerCasFilter(sce, "Cas Authorization Filter", CasAuthorizationFilter.class, null);
            } catch (Exception e) {
                throw new RuntimeException("Failed to register CAS filters", e);
            }
        }
    }

    private void registerFilter(ServletContextEvent sce, String filterName,
                                Class<? extends Filter> filterClass, Map<String, String> initParameters, String... urlPatterns) {
        FilterRegistration.Dynamic filter = sce.getServletContext().addFilter(filterName, filterClass);

        if (initParameters != null) {
            for (Map.Entry<String, String> entry : initParameters.entrySet()) {
                filter.setInitParameter(entry.getKey(), entry.getValue());
            }
        }

        filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, urlPatterns);
    }

    private void registerCasFilter(ServletContextEvent sce, String filterName,
                                   Class<? extends Filter> filterClass, Map<String, String> initParameters, String... customUrlPatterns) {
        String[] urlPatterns = (customUrlPatterns != null && customUrlPatterns.length > 0)
                ? customUrlPatterns
                : patternsProtectedByCas.toArray(new String[0]);
        registerFilter(sce, filterName, filterClass, initParameters, urlPatterns);
    }

    private String getServerNameFromUrl(String url) {
        try {
            URL urlObject = new URL(url);
            String port = (urlObject.getPort() == -1) ? "" : ":" + urlObject.getPort();
            return urlObject.getProtocol() + "://" + urlObject.getHost() + port;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error parsing server name from URL", e);
        }
    }

    private static class JspForwardServlet extends HttpServlet {
        private static final long serialVersionUID = 1L;
        private final String jspPath;

        public JspForwardServlet(String jspPath) {
            this.jspPath = jspPath;
        }

        @Override
        protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
            req.getRequestDispatcher(jspPath).forward(req, resp);
        }
    }
}
