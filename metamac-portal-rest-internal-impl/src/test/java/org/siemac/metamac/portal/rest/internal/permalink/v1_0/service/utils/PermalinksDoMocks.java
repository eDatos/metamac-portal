package org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.utils;

import org.siemac.metamac.portal.core.domain.Permalink;

public class PermalinksDoMocks {

    public static Permalink mockPermalink(String code, String content) {
        Permalink permalink = new Permalink();
        if (code != null) {
            permalink.setCode(code);
        }
        permalink.setContent(content);
        return permalink;
    }
}