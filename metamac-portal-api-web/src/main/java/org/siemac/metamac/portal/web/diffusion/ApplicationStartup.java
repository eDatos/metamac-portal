package org.siemac.metamac.portal.web.diffusion;

import javax.servlet.ServletContextEvent;

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
        return "statistical-visualizer-api";
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

        } catch (MetamacException e) {
            log.error("Error retrieving application configuration", e);
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
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_PORTAL_EXTERNAL_BASE);

        // Export require external endpoints
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_INDICATORS_EXTERNAL_API);
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_EXTERNAL_API);
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);

        // Export needs to know the cell threshold for excel high performance mode
        checkRequiredProperty(PortalConfigurationConstants.PORTAL_EXPORT_EXCEL_CELL_THRESHOLD);

        // Visualizer (also the api ones)
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_ORGANISATION);
        String INSTALLATION_TYPE = portalConfigurationService.retrieveInstallationType();

        if (INSTALLATION_TYPE.equals("INTERNAL")) {
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_INDICATORS_INTERNAL_API);
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_INTERNAL_API);
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_INTERNAL_API);
        }
    }

}
