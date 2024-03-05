package org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper;

import org.siemac.metamac.portal.core.domain.Permalink;
import org.springframework.stereotype.Component;

@Component
public class PermalinksRest2DoMapperV10Impl implements PermalinksRest2DoMapperV10 {

    @Override
    public Permalink toPermalink(org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink source) throws Exception {
        Permalink target = new Permalink();
        target.setContent(source.getContent());
        return target;
    }
}