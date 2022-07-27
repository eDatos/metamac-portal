package org.siemac.metamac.portal.web;

import javax.servlet.ServletContextEvent;

import org.siemac.edatos.core.common.constants.shared.ConfigurationConstants;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.listener.ApplicationStartupListener;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplicationStartup extends ApplicationStartupListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationStartup.class);

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
        try {
            String INSTALLATION_TYPE = portalConfigurationService.retrieveInstallationType();
            if (INSTALLATION_TYPE.equals("EXTERNAL")) {
                WebUtils.setAppsBaseUrl(configurationService.retrieveAppsExternalWebApplicationUrlBase());
            } else if (INSTALLATION_TYPE.equals("INTERNAL")) {
                WebUtils.setAppsBaseUrl(configurationService.retrieveAppsInternalWebApplicationUrlBase());
            }
            WebUtils.setExportApiBaseURL(configurationService.retrievePortalExternalApisExportUrlBase());
            WebUtils.setPermalinksApiBaseURL(configurationService.retrievePortalExternalApisPermalinksUrlBase());

            WebUtils.setApiStyleHeaderUrl(configurationService.retrieveApiStyleHeaderUrl());
            WebUtils.setApiStyleCssUrl(configurationService.retrieveApiStyleCssUrl());
            WebUtils.setApiStyleFooterUrl(configurationService.retrieveApiStyleFooterUrl());

            WebUtils.setPortalDefaultStyleHeaderUrl(portalConfigurationService.retrievePortalDefaultStyleHeaderUrl());
            WebUtils.setPortalDefaultStyleCssUrl(portalConfigurationService.retrievePortalDefaultStyleCssUrl());
            WebUtils.setPortalDefaultStyleFooterUrl(portalConfigurationService.retrievePortalDefaultStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application configuration", e);
        }

        setPortalAgricultureStyles();
        setPortalEnvironmentStyles();
        setPortalTourismStyles();
        setPortalPublicServiceStyles();
        setPortalCustomStyles();

        setSocialTwitterVia();
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
            log.info("Error retrieving application Social Twitter Via", e);
        }
    }

    @Override
    public void checkApplicationProperties() throws MetamacException {
        // Datasource
        checkRequiredProperty(PortalConfigurationConstants.DB_DRIVER_NAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_URL);
        checkRequiredProperty(PortalConfigurationConstants.DB_USERNAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_PASSWORD);
        checkRequiredProperty(PortalConfigurationConstants.DB_DIALECT);

        // Api
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
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

        // Google analytics
        checkRequiredProperty(PortalConfigurationConstants.ANALYTICS_GOOGLE_TRACKING_ID);

        // Social
        checkOptionalProperty(ConfigurationConstants.SHARED_SOCIAL_TWITTER_VIA);
    }
}
