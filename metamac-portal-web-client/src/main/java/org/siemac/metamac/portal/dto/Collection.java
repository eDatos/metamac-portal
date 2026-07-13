package org.siemac.metamac.portal.dto;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;

public class Collection {

    protected InternationalString name;
    protected InternationalString description;
    protected InternationalString keywords;
    protected CollectionData      data;
    protected CollectionMetadata  metadata;

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

    public CollectionData getData() {
        return data;
    }

    public void setData(CollectionData value) {
        data = value;
    }

    public CollectionMetadata getMetadata() {
        return metadata;
    }

    public void setMetadata(CollectionMetadata value) {
        metadata = value;
    }
}
