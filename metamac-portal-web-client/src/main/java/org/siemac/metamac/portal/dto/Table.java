package org.siemac.metamac.portal.dto;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase;

public class Table extends CollectionNode {

    // Antes, resourceInternal (org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.ResourceInternal)
    protected ResourceStatisticalResourceBase dataset;
    protected ResourceStatisticalResourceBase query;
    protected ResourceStatisticalResourceBase multidataset;
    protected ResourceStatisticalResourceBase url;

    /**
     * Gets the value of the dataset property.
     *
     * @return
     *         possible object is
     *         {@link ResourceInternal }
     */
    public ResourceStatisticalResourceBase getDataset() {
        return dataset;
    }

    /**
     * Sets the value of the dataset property.
     *
     * @param value
     *            allowed object is
     *            {@link ResourceInternal }
     */
    public void setDataset(ResourceStatisticalResourceBase value) {
        dataset = value;
    }

    /**
     * Gets the value of the query property.
     *
     * @return
     *         possible object is
     *         {@link ResourceInternal }
     */
    public ResourceStatisticalResourceBase getQuery() {
        return query;
    }

    /**
     * Sets the value of the query property.
     *
     * @param value
     *            allowed object is
     *            {@link ResourceInternal }
     */
    public void setQuery(ResourceStatisticalResourceBase value) {
        query = value;
    }

    public ResourceStatisticalResourceBase getMultidataset() {
        return multidataset;
    }

    public void setMultidataset(ResourceStatisticalResourceBase multidataset) {
        this.multidataset = multidataset;
    }

    public ResourceStatisticalResourceBase getUrl() {
        return url;
    }

    public void setUrl(ResourceStatisticalResourceBase url) {
        this.url = url;
    }

    public ResourceStatisticalResourceBase getResource() {
        ResourceStatisticalResourceBase resource = null;

        if (getDataset() != null) {
            resource = getDataset();
        } else if (getQuery() != null) {
            resource = getQuery();
        } else if (getMultidataset() != null) {
            resource = getMultidataset();
        } else if (getUrl() != null) {
            resource = getUrl();
        }

        return resource;
    }

}
