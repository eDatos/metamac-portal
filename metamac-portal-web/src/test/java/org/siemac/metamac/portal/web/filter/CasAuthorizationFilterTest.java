package org.siemac.metamac.portal.web.filter;

import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.validation.Assertion;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.siemac.metamac.portal.Helpers;
import org.siemac.metamac.portal.core.constants.PortalConstants;
import org.siemac.metamac.sso.client.MetamacPrincipal;
import org.siemac.metamac.sso.client.MetamacPrincipalAccess;
import org.siemac.metamac.sso.client.SsoClientConstants;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class CasAuthorizationFilterTest {

    private CasAuthorizationFilter filter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpSession session;

    @Mock
    private Assertion assertion;

    @Mock
    private AttributePrincipal attributePrincipal;

    @Mock
    private MetamacPrincipal metamacPrincipal;

    // Application names
    private static final String GESTOR_RECURSOS_ESTADISTICOS = "GESTOR_RECURSOS_ESTADISTICOS";
    private static final String GESTOR_INDICADORES = "GESTOR_INDICADORES";
    private static final String GESTOR_RECURSOS_ESTRUCTURALES = "GESTOR_RECURSOS_ESTRUCTURALES";

    // Collection paths
    private static final String[] COLLECTION_PATHS = {
        "/visualizer/collection.html",
        "/visualizer/custom/collection.html",
        "/visualizer/agricultura/collection.html",
        "/visualizer/medioambiente/collection.html",
        "/visualizer/turismo/collection.html",
        "/visualizer/funcion-publica/collection.html",
        "/visualizer/iqua/collection.html"
    };

    // Data paths
    private static final String[] DATA_PATHS = {
        "/visualizer/data.html",
        "/visualizer/custom/data.html",
        "/visualizer/agricultura/data.html",
        "/visualizer/medioambiente/data.html",
        "/visualizer/turismo/data.html",
        "/visualizer/funcion-publica/data.html",
        "/visualizer/iqua/data.html"
    };

    // Pages that support resource type parameter
    private static final String[] PAGES_WITH_RESOURCE_TYPE = {
        "/visualizer/data.html",
        "/visualizer/custom/data.html",
        "/visualizer/agricultura/data.html",
        "/visualizer/medioambiente/data.html",
        "/visualizer/turismo/data.html",
        "/visualizer/funcion-publica/data.html",
        "/visualizer/iqua/data.html",
        "/widget.html"
    };

    @Before
    public void setUp() {
        filter = new CasAuthorizationFilter();

        when(request.getSession()).thenReturn(session);
        when(session.getAttribute("_const_cas_assertion_")).thenReturn(assertion);
        when(assertion.getPrincipal()).thenReturn(attributePrincipal);

        Map<String, Object> principalAttributes = new HashMap<>();
        principalAttributes.put(SsoClientConstants.PRINCIPAL_ATTRIBUTE, metamacPrincipal);
        when(attributePrincipal.getAttributes()).thenReturn(principalAttributes);
    }

    // ========================================================================
    // TESTS: GESTOR_RECURSOS_ESTADISTICOS
    // ========================================================================

    @Test
    public void testStatisticalResourcesAccessToOperations() throws IOException, ServletException {
        testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, "/visualizer/operations.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesAccessToAllCollectionPages() throws IOException, ServletException {
        for (String path : COLLECTION_PATHS) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, null, null, null);
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessToDatasetWithoutResourceType() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, path, null, null, null);
        }
    }

    @Test
    public void testStatisticalResourcesAccessToDataWithDataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.DATASET.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesAccessToDataWithQuery() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.QUERY.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesAccessToDataWithMultidataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessToDataWithIndicators() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.INDICATOR.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessToDataWithIndicatorInstances() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessToWidgetWithoutResourceType() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesAccessToWidgetWithDataset() throws IOException, ServletException {
        testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", PortalConstants.ResourceType.DATASET.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesAccessToWidgetWithQuery() throws IOException, ServletException {
        testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", PortalConstants.ResourceType.QUERY.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesAccessToWidgetWithMultidataset() throws IOException, ServletException {
        testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesCannotAccessToWidgetWithIndicators() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", PortalConstants.ResourceType.INDICATOR.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesCannotAccessToWidgetWithIndicatorInstances() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, "/widget.html", PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesAccessTo403ErrorPage() throws IOException, ServletException {
        testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, "/error/403.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesAccessOnlyWithPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, null, "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesAccessOnlyWithMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, null, null, "someMultidatasetId");
        }
    }

    @Test
    public void testStatisticalResourcesAccessWithDatasetAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.DATASET.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesAccessWithDatasetAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.DATASET.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessWithIndicatorAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.INDICATOR.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesCannotAccessWithIndicatorAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTADISTICOS, path, PortalConstants.ResourceType.INDICATOR.getName(), null, "someMultidatasetId");
        }
    }

    // ========================================================================
    // TESTS: GESTOR_INDICADORES
    // ========================================================================

    @Test
    public void testIndicatorsCannotAccessToOperations() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/visualizer/operations.html", null, null, null);
    }

    @Test
    public void testIndicatorsCannotAccessToAllCollectionPages() throws IOException, ServletException {
        for (String path : COLLECTION_PATHS) {
            testAccessDenied(GESTOR_INDICADORES, path, null, null, null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessToDatasetWithoutResourceType() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_INDICADORES, path, null, null, null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessToDataWithDataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_INDICADORES, path, PortalConstants.ResourceType.DATASET.getName(), null, null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessToDataWithQuery() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_INDICADORES, path, PortalConstants.ResourceType.QUERY.getName(), null, null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessToDataWithMultidataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_INDICADORES, path, PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
        }
    }

    @Test
    public void testIndicatorsAccessToDataWithIndicators() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(GESTOR_INDICADORES, path, PortalConstants.ResourceType.INDICATOR.getName(), null, null);
        }
    }

    @Test
    public void testIndicatorsAccessToDataWithIndicatorInstances() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(GESTOR_INDICADORES, path, PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessToWidgetWithoutResourceType() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/widget.html", null, null, null);
    }

    @Test
    public void testIndicatorsCannotAccessToWidgetWithDataset() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/widget.html", PortalConstants.ResourceType.DATASET.getName(), null, null);
    }

    @Test
    public void testIndicatorsCannotAccessToWidgetWithQuery() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/widget.html", PortalConstants.ResourceType.QUERY.getName(), null, null);
    }

    @Test
    public void testIndicatorsCannotAccessToWidgetWithMultidataset() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/widget.html", PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
    }

    @Test
    public void testIndicatorsAccessToWidgetWithIndicators() throws IOException, ServletException {
        testAccessGranted(GESTOR_INDICADORES, "/widget.html", PortalConstants.ResourceType.INDICATOR.getName(), null, null);
    }

    @Test
    public void testIndicatorsAccessToWidgetWithIndicatorInstances() throws IOException, ServletException {
        testAccessGranted(GESTOR_INDICADORES, "/widget.html", PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
    }

    @Test
    public void testIndicatorsAccessTo403ErrorPage() throws IOException, ServletException {
        testAccessGranted(GESTOR_INDICADORES, "/error/403.html", null, null, null);
    }

    @Test
    public void testIndicatorsAccessOnlyWithPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_INDICADORES, path, null, "somePermalink", null);
        }
    }

    @Test
    public void testIndicatorsAccessOnlyWithMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_INDICADORES, path, null, null, "someMultidatasetId");
        }
    }

    @Test
    public void testIndicatorsAccessWithIndicatorAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_INDICADORES, path, PortalConstants.ResourceType.INDICATOR.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testIndicatorsAccessWithIndicatorAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(GESTOR_INDICADORES, path, PortalConstants.ResourceType.INDICATOR.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testIndicatorsCannotAccessWithDatasetAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_INDICADORES, path, PortalConstants.ResourceType.DATASET.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testIndicatorsCannotAccessWithDatasetAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_INDICADORES, path, PortalConstants.ResourceType.DATASET.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testIndicatorsCannotAccessToOperationsOnlyForUsingPermalink() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/visualizer/operations.html", null, "somePermalink", null);
    }

    @Test
    public void testIndicatorsCannotAccessToOperationsOnlyForUsingMultidatasetId() throws IOException, ServletException {
        testAccessDenied(GESTOR_INDICADORES, "/visualizer/operations.html", null, null, "someMultidatasetId");
    }

    // ========================================================================
    // TESTS: GESTOR_RECURSOS_ESTRUCTURALES (NO ACCESS AT ALL)
    // ========================================================================

    @Test
    public void testStructuralResourcesCannotAccessToOperations() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/visualizer/operations.html", null, null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToAllCollectionPages() throws IOException, ServletException {
        for (String path : COLLECTION_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, null, null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDatasetWithoutResourceType() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, null, null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDataWithDataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.DATASET.getName(), null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDataWithQuery() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.QUERY.getName(), null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDataWithMultidataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDataWithIndicators() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.INDICATOR.getName(), null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToDataWithIndicatorInstances() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithoutResourceType() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", null, null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithDataset() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", PortalConstants.ResourceType.DATASET.getName(), null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithQuery() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", PortalConstants.ResourceType.QUERY.getName(), null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithMultidataset() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithIndicators() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", PortalConstants.ResourceType.INDICATOR.getName(), null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToWidgetWithIndicatorInstances() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/widget.html", PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessTo403ErrorPage() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/error/403.html", null, null, null);
    }

    @Test
    public void testStructuralResourcesCannotAccessOnlyWithPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, null, "somePermalink", null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessOnlyWithMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, null, null, "someMultidatasetId");
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessWithDatasetAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.DATASET.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessWithDatasetAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.DATASET.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessWithIndicatorAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.INDICATOR.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessWithIndicatorAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, path, PortalConstants.ResourceType.INDICATOR.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testStructuralResourcesCannotAccessToOperationsOnlyForUsingPermalink() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/visualizer/operations.html", null, "somePermalink", null);
    }

    @Test
    public void testStructuralResourcesCannotAccessToOperationsOnlyForUsingMultidatasetId() throws IOException, ServletException {
        testAccessDenied(GESTOR_RECURSOS_ESTRUCTURALES, "/visualizer/operations.html", null, null, "someMultidatasetId");
    }

    // ========================================================================
    // TESTS: GESTOR_RECURSOS_ESTADISTICOS + GESTOR_INDICADORES
    // ========================================================================

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToOperations() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/visualizer/operations.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToAllCollectionPages() throws IOException, ServletException {
        for (String path : COLLECTION_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, null, null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsCannotAccessToDatasetWithoutResourceType() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, null, null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToDataWithDataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.DATASET.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToDataWithQuery() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.QUERY.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToDataWithMultidataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToDataWithIndicators() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.INDICATOR.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToDataWithIndicatorInstances() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsCannotAccessToWidgetWithoutResourceType() throws IOException, ServletException {
        testAccessDenied(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToWidgetWithDataset() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", PortalConstants.ResourceType.DATASET.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToWidgetWithQuery() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", PortalConstants.ResourceType.QUERY.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToWidgetWithMultidataset() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToWidgetWithIndicators() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", PortalConstants.ResourceType.INDICATOR.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessToWidgetWithIndicatorInstances() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/widget.html", PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessTo403ErrorPage() throws IOException, ServletException {
        testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, "/error/403.html", null, null, null);
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessOnlyWithPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, null, "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessOnlyWithMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, null, null, "someMultidatasetId");
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessWithDatasetAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.DATASET.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessWithDatasetAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.DATASET.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessWithIndicatorAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.INDICATOR.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testStatisticalResourcesPlusIndicatorsAccessWithIndicatorAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessGranted(new String[]{GESTOR_RECURSOS_ESTADISTICOS, GESTOR_INDICADORES}, path, PortalConstants.ResourceType.INDICATOR.getName(), null, "someMultidatasetId");
        }
    }

    // ========================================================================
    // TESTS: NO ACCESS
    // ========================================================================

    @Test
    public void testNoAppsCannotAccessToOperations() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/visualizer/operations.html", null, null, null);
    }

    @Test
    public void testNoAppsCannotAccessToAllCollectionPages() throws IOException, ServletException {
        for (String path : COLLECTION_PATHS) {
            testAccessDenied(new String[]{}, path, null, null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDatasetWithoutResourceType() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, null, null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDataWithDataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.DATASET.getName(), null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDataWithQuery() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.QUERY.getName(), null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDataWithMultidataset() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDataWithIndicators() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.INDICATOR.getName(), null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToDataWithIndicatorInstances() throws IOException, ServletException {
        for (String path : DATA_PATHS) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
        }
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithoutResourceType() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", null, null, null);
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithDataset() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", PortalConstants.ResourceType.DATASET.getName(), null, null);
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithQuery() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", PortalConstants.ResourceType.QUERY.getName(), null, null);
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithMultidataset() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", PortalConstants.ResourceType.MULTIDATASET.getName(), null, null);
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithIndicators() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", PortalConstants.ResourceType.INDICATOR.getName(), null, null);
    }

    @Test
    public void testNoAppsCannotAccessToWidgetWithIndicatorInstances() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/widget.html", PortalConstants.ResourceType.INDICATOR_INSTANCE.getName(), null, null);
    }

    @Test
    public void testNoAppsCannotAccessTo403ErrorPage() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/error/403.html", null, null, null);
    }

    @Test
    public void testNoAppsAccessWithOnlyPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, null, "somePermalink", null);
        }
    }

    @Test
    public void testNoAppsAccessWithOnlyMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, null, null, "someMultidatasetId");
        }
    }

    @Test
    public void testNoAppsCannotAccessWithDatasetAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.DATASET.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testNoAppsCannotAccessWithDatasetAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.DATASET.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testNoAppsCannotAccessWithIndicatorAndPermalink() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.INDICATOR.getName(), "somePermalink", null);
        }
    }

    @Test
    public void testNoAppsCannotAccessWithIndicatorAndMultidatasetId() throws IOException, ServletException {
        for (String path : PAGES_WITH_RESOURCE_TYPE) {
            testAccessDenied(new String[]{}, path, PortalConstants.ResourceType.INDICATOR.getName(), null, "someMultidatasetId");
        }
    }

    @Test
    public void testNoAppsCannotAccessToOperationsOnlyForUsingPermalink() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/visualizer/operations.html", null, "somePermalink", null);
    }

    @Test
    public void testNoAppsCannotAccessToOperationsOnlyForUsingMultidatasetId() throws IOException, ServletException {
        testAccessDenied(new String[]{}, "/visualizer/operations.html", null, null, "someMultidatasetId");
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private void setupUserWithAccess(String... applications) {
        List<MetamacPrincipalAccess> accesses = new ArrayList<>();
        for (String app : applications) {
            MetamacPrincipalAccess access = new MetamacPrincipalAccess();
            access.setApplication(app);
            // role is irrelevant for this filter
            accesses.add(access);
        }
        when(metamacPrincipal.getAccesses()).thenReturn(accesses);
    }

    private void testAccessGranted(String application, String servletPath, String resourceType, String permalink, String multidatasetId) throws IOException, ServletException {
        testAccessGranted(new String[]{application}, servletPath, resourceType, permalink, multidatasetId);
    }

    private void testAccessGranted(String[] applications, String servletPath, String resourceType, String permalink, String multidatasetId) throws IOException, ServletException {
        setupUserWithAccess(applications);

        when(request.getServletPath()).thenReturn(servletPath);
        when(request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE)).thenReturn(resourceType);
        when(request.getParameter(Helpers.PARAMETER_PERMALINK)).thenReturn(permalink);
        when(request.getParameter(Helpers.PARAMETER_MULTIDATASET_ID)).thenReturn(multidatasetId);

        Map<String, String[]> params = new HashMap<>();
        if (resourceType != null) {
            params.put(Helpers.PARAMETER_RESOURCE_TYPE, new String[]{resourceType});
        }
        if (permalink != null) {
            params.put(Helpers.PARAMETER_PERMALINK, new String[]{permalink});
        }
        if (multidatasetId != null) {
            params.put(Helpers.PARAMETER_MULTIDATASET_ID, new String[]{multidatasetId});
        }
        when(request.getParameterMap()).thenReturn(params);

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(response, never()).sendRedirect(anyString());

        reset(filterChain, response);
    }

    private void testAccessDenied(String application, String servletPath, String resourceType, String permalink, String multidatasetId) throws IOException, ServletException {
        testAccessDenied(new String[]{application}, servletPath, resourceType, permalink, multidatasetId);
    }

    private void testAccessDenied(String[] applications, String servletPath, String resourceType, String permalink, String multidatasetId) throws IOException, ServletException {
        setupUserWithAccess(applications);

        when(request.getServletPath()).thenReturn(servletPath);
        when(request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE)).thenReturn(resourceType);
        when(request.getParameter(Helpers.PARAMETER_PERMALINK)).thenReturn(permalink);
        when(request.getParameter(Helpers.PARAMETER_MULTIDATASET_ID)).thenReturn(multidatasetId);

        Map<String, String[]> params = new HashMap<>();
        if (resourceType != null) {
            params.put(Helpers.PARAMETER_RESOURCE_TYPE, new String[]{resourceType});
        }
        if (permalink != null) {
            params.put(Helpers.PARAMETER_PERMALINK, new String[]{permalink});
        }
        if (multidatasetId != null) {
            params.put(Helpers.PARAMETER_MULTIDATASET_ID, new String[]{multidatasetId});
        }
        when(request.getParameterMap()).thenReturn(params);

        filter.doFilter(request, response, filterChain);

        verify(response).sendRedirect(contains("/error/403.html"));
        verify(filterChain, never()).doFilter(request, response);

        reset(filterChain, response);
    }
}
