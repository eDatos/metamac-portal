package org.siemac.metamac.portal.core.serviceapi.utils;

import java.io.InputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;

public class XMLUtils {

    private static final Unmarshaller unmarshaller = initializeUnmarshaller();

    private static Unmarshaller initializeUnmarshaller() {
        // No validation is performed against scheme because we use a mixed approach to optimize the unpacking. (DOM + StAX)
        JAXBContext jc;
        Unmarshaller u;
        try {
            jc = JAXBContext.newInstance(org.siemac.metamac.rest.statistical_resources.v1_0.domain.ObjectFactory.class,
                    org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ObjectFactory.class, org.siemac.metamac.rest.common.v1_0.domain.ObjectFactory.class);
            u = jc.createUnmarshaller();

        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }

        return u;
    }

    public static DatasetBase getDataset(InputStream is) throws JAXBException {
        return (DatasetBase) unmarshaller.unmarshal(is);
    }

    public static QueryBase getQuery(InputStream is) throws JAXBException {
        return (QueryBase) unmarshaller.unmarshal(is);
    }

}
