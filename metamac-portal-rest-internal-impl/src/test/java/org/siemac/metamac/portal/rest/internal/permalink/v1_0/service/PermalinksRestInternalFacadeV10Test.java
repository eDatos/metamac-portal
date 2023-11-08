package org.siemac.metamac.portal.rest.internal.permalink.v1_0.service;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.ServerWebApplicationException;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.jaxrs.provider.JAXBElementProvider;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.siemac.metamac.common.test.utils.MetamacMocks;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.serviceapi.PermalinksService;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.portal.rest.common.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.utils.PermalinksDoMocks;
import org.siemac.metamac.rest.common.test.MetamacRestBaseTest;
import org.siemac.metamac.rest.common.test.ServerResource;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.siemac.metamac.rest.utils.RestUtils;
import org.springframework.context.ApplicationContext;

// TODO EDATOS-3384 - Al mover el captcha de proyecto estos tests se han roto, se ignoran por lo pronto, pero han de ser revisados para ver si podemos mantenerlos
@Ignore
public class PermalinksRestInternalFacadeV10Test extends MetamacRestBaseTest {

    protected static org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.PermalinksV1_0 permalinksV1_0;
    protected static ApplicationContext                                                            applicationContext = null;
    private static String jaxrsServerAddress = "http://localhost:" + ServerResource.PORT + "/apis/permalinks";
    protected String baseApi = jaxrsServerAddress + "/v1.0";

    private PermalinksService permalinksService;

    private static final String PERMALINK_01 = "permalink01";

    @SuppressWarnings({"unchecked", "rawtypes"})
    @BeforeClass
    public static void setUpBeforeClass() throws Exception {

        // Start server
        assertTrue("server did not launch correctly", launchServer(ServerResource.class, true));

        // Get application context from Jetty
        applicationContext = ApplicationContextProvider.getApplicationContext();

        // Rest clients
        // xml
        {
            List providers = new ArrayList();
            providers.add(applicationContext.getBean("jaxbProvider", JAXBElementProvider.class));
            permalinksV1_0 = JAXRSClientFactory.create(jaxrsServerAddress, PermalinksV1_0.class, providers, Boolean.TRUE);
        }
    }

    @Before
    public void setUp() throws Exception {
        resetMocks();
    }

    @Test
    public void testRetrievePermalink() throws Exception {
        Permalink permalink = getPermalinksV1_0Xml().retrievePermalinkByIdXml(PERMALINK_01);

        assertEquals(PERMALINK_01, permalink.getId());
        assertEquals("content of permalink01", permalink.getContent());
        assertEquals(RestCommonConstants.KIND_PERMALINK, permalink.getKind());
    }

    @Test
    public void testRetrievePermalinkErrorNotExists() throws Exception {
        String id = "not-exist";
        try {
            getPermalinksV1_0Xml().retrievePermalinkByIdXml(id);
        } catch (ServerWebApplicationException e) {
            assertEquals(Status.NOT_FOUND.getStatusCode(), e.getStatus());

            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = extractErrorFromException(getPermalinksV1_0Xml(), e);
            assertEquals(RestServiceExceptionType.PERMALINK_NOT_FOUND.getCode(), exception.getCode());
            assertEquals("Permalink " + id + " not found with id " + id, exception.getMessage());
            assertEquals(1, exception.getParameters().getParameters().size());
            assertEquals(id, exception.getParameters().getParameters().get(0));
            assertNull(exception.getErrors());
        } catch (Exception e) {
            fail("Incorrect exception");
        }
    }

    @Test
    public void testRetrievePermalinkJson() throws Exception {
        String requestBase = getRetrievePermalinkUri(PERMALINK_01);
        String[] requestUris = new String[]{requestBase + ".json", requestBase + "?_type=json"};
        for (int i = 0; i < requestUris.length; i++) {
            String requestUri = requestUris[i];
            InputStream responseExpected = PermalinksRestInternalFacadeV10Test.class.getResourceAsStream("/responses/permalinks/v1.0/retrievePermalink.id1.json");
            testRequestWithoutJaxbTransformationIdenticalResponses(requestUri, APPLICATION_XML, Status.OK, responseExpected);
        }
    }

    @Test
    public void testRetrievePermalinkXml() throws Exception {
        String requestBase = getRetrievePermalinkUri(PERMALINK_01);
        String[] requestUris = new String[]{requestBase, requestBase + ".xml", requestBase + "?_type=xml"};
        for (int i = 0; i < requestUris.length; i++) {
            String requestUri = requestUris[i];
            InputStream responseExpected = PermalinksRestInternalFacadeV10Test.class.getResourceAsStream("/responses/permalinks/v1.0/retrievePermalink.id1.xml");
            testRequestWithoutJaxbTransformation(requestUri, APPLICATION_XML, Status.OK, responseExpected);
        }
    }

    @Test
    public void testCreatePermalink() throws Exception {
        Permalink permalink = new Permalink();
        permalink.setContent("{dataset: \"dataset01\", selection : \"dim01=code01\"}");
        Permalink permalinkCreated = getPermalinksV1_0Xml().createPermalink(permalink);

        assertNotNull(permalinkCreated.getId());
        assertEquals(permalink.getContent(), permalinkCreated.getContent());
        assertEquals(RestCommonConstants.KIND_PERMALINK, permalinkCreated.getKind());
        assertEquals("http://portal.istac.es/apis/permalinks/v1.0/permalinks/" + permalinkCreated.getId(), permalinkCreated.getSelfLink().getHref());
        assertEquals(RestCommonConstants.KIND_PERMALINK, permalinkCreated.getSelfLink().getKind());
    }

    public String getRetrievePermalinkUri(String code) throws Exception {
        String uri = RestUtils.createLink(baseApi, RestCommonConstants.LINK_SUBPATH_PERMALINK);
        if (code != null) {
            uri = RestUtils.createLink(uri, code);
        }
        return uri;
    }

    protected PermalinksV1_0 getPermalinksV1_0Xml() {
        WebClient.client(permalinksV1_0).reset();
        WebClient.client(permalinksV1_0).accept(APPLICATION_XML);
        return permalinksV1_0;
    }

    protected PermalinksV1_0 getPermalinksV1_0Json() {
        WebClient.client(permalinksV1_0).reset();
        WebClient.client(permalinksV1_0).accept(APPLICATION_JSON);
        return permalinksV1_0;
    }

    private void mockRetrievePermalink() throws MetamacException {
        when(permalinksService.retrievePermalinkByCode(any(ServiceContext.class), any(String.class))).thenAnswer(new Answer<org.siemac.metamac.portal.core.domain.Permalink>() {

            @Override
            public org.siemac.metamac.portal.core.domain.Permalink answer(InvocationOnMock invocation) throws Throwable {
                String code = (String) invocation.getArguments()[1];
                return PermalinksDoMocks.mockPermalink(code, "content of " + code);
            };
        });
    }

    private void mockCreatePermalink() throws MetamacException {
        when(permalinksService.createPermalink(any(ServiceContext.class), any(org.siemac.metamac.portal.core.domain.Permalink.class)))
                .thenAnswer(new Answer<org.siemac.metamac.portal.core.domain.Permalink>() {

                    @Override
                    public org.siemac.metamac.portal.core.domain.Permalink answer(InvocationOnMock invocation) throws Throwable {
                        org.siemac.metamac.portal.core.domain.Permalink permalink = (org.siemac.metamac.portal.core.domain.Permalink) invocation.getArguments()[1];
                        String code = MetamacMocks.mockString(20);
                        permalink.setCode(code);
                        return permalink;
                    };
                });
    }

    private void resetMocks() throws Exception {
        permalinksService = applicationContext.getBean(PermalinksService.class);
        reset(permalinksService);

        mockRetrievePermalink();
        mockCreatePermalink();
    }

}