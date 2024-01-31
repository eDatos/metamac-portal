package org.siemac.metamac.portal.rest.common.adapter;

import java.util.Date;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class DateTimeAdapter extends XmlAdapter<String, Date> {

    @Override
    public Date unmarshal(String value) {
        return (org.apache.cxf.xjc.runtime.DataTypeAdapter.parseDateTime(value));
    }

    @Override
    public String marshal(Date value) {
        return (org.apache.cxf.xjc.runtime.DataTypeAdapter.printDateTime(value));
    }
}