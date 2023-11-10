package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.portal.rest.external.permalink.v1_0.service.utils.PermalinksDoMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/portal-rest-external/applicationContext-test.xml"})
public class PermalinksDo2RestMapperV10Test {

    @Autowired
    private PermalinksDo2RestMapperV10Impl permalinksDo2RestMapperV10;

    @Test
    public void testToPermalink() throws Exception {

        Permalink source = PermalinksDoMocks.mockPermalink("permalink01", "content of permalink01");

        // Transform
        org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink target = permalinksDo2RestMapperV10.toPermalink(source);

        // Validate
        assertEquals(RestCommonConstants.KIND_PERMALINK, target.getKind());
        assertEquals("permalink01", target.getId());
        assertEquals("content of permalink01", target.getContent());
        assertEquals("http://portal.istac.es/apis/permalinks/v1.0/permalinks/permalink01", target.getSelfLink().getHref());
        assertEquals(target.getKind(), target.getSelfLink().getKind());
    }
}