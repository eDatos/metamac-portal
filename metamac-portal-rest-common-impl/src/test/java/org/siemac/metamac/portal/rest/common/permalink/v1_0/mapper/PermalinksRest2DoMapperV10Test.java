package org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/portal-rest-common/applicationContext-test.xml"})
public class PermalinksRest2DoMapperV10Test {

    @Autowired
    private PermalinksRest2DoMapperV10 permalinksRest2Do2MapperV10;

    @Test
    public void testToPermalink() throws Exception {

        org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink source = new org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink();
        source.setContent("content of permalink01");

        // Transform
        Permalink target = permalinksRest2Do2MapperV10.toPermalink(source);

        // Validate
        assertNull(target.getCode());
        assertEquals("content of permalink01", target.getContent());
    }
}