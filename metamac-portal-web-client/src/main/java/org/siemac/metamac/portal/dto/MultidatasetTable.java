package org.siemac.metamac.portal.dto;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase;

public class MultidatasetTable extends MultidatasetNode {

    // Antes, resourceInternal (org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.ResourceInternal)
    protected ResourceStatisticalResourceBase dataset;
    protected ResourceStatisticalResourceBase query;

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

}
