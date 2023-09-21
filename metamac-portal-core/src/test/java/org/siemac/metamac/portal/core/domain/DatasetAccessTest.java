package org.siemac.metamac.portal.core.domain;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class DatasetAccessTest {

    private ResourceAccess datasetAccessForExcel;

    @Before
    public void before() throws Exception {
        //@formatter:off
        Dataset dataset = DatasetMockBuilder.create()
                .observations("1.35 | 2.24 |  | 4.5")
                .dimension("DIM_A", "Dimension A")
                .dimensionValue("DIM_A_0", "Representation A0")
                .dimensionValue("DIM_A_1", "Representation A1")
                .dimension("DIM_B", "Dimension B")
                .dimensionValue("DIM_B_0", "Representation B0")
                .dimensionValue("DIM_B_1", "Representation B1")
                .build();
        //@formatter:on
        datasetAccessForExcel = new ResourceAccess(dataset, null, "es", "es");
    }

    @Test
    public void testObservationAtPermutation() throws Exception {
        Map<String, String> p1 = new HashMap<String, String>();
        p1.put("DIM_A", "DIM_A_0");
        p1.put("DIM_B", "DIM_B_0");
        assertEquals("1.35", datasetAccessForExcel.observationAtPermutation(p1));

        Map<String, String> p2 = new HashMap<String, String>();
        p2.put("DIM_A", "DIM_A_1");
        p2.put("DIM_B", "DIM_B_1");
        assertEquals("4.5", datasetAccessForExcel.observationAtPermutation(p2));

        Map<String, String> p3 = new HashMap<String, String>();
        p3.put("DIM_A", "DIM_A_1");
        p3.put("DIM_B", "DIM_B_0");
        assertEquals(null, datasetAccessForExcel.observationAtPermutation(p3));
    }

    @Test
    public void testRepresentationLabel() {
        assertEquals("Representation A0", datasetAccessForExcel.getDimensionValueLabelCurrentLocale("DIM_A", "DIM_A_0"));
        assertEquals("Representation B1", datasetAccessForExcel.getDimensionValueLabelCurrentLocale("DIM_B", "DIM_B_1"));
    }

}
