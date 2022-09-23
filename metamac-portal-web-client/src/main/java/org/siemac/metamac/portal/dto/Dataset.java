package org.siemac.metamac.portal.dto;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;

public class Dataset {

    protected InternationalString name;
    protected InternationalString description;
    protected InternationalString keywords;

    public InternationalString getName() {
        return name;
    }

    public void setName(InternationalString value) {
        name = value;
    }

    public InternationalString getDescription() {
        return description;
    }

    public void setDescription(InternationalString value) {
        description = value;
    }

    public InternationalString getKeywords() {
        return keywords;
    }

    public void setKeywords(InternationalString keywords) {
        this.keywords = keywords;
    }

}
