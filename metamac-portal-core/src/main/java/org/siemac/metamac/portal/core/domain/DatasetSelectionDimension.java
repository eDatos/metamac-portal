package org.siemac.metamac.portal.core.domain;

import java.util.List;

import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public class DatasetSelectionDimension {

    private final String               id;
    private List<String>               selectedDimensionValues;

    private LabelVisualisationModeEnum labelVisualisationMode;
    private Integer                    position;
    private Boolean                    reversed;

    public DatasetSelectionDimension(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public LabelVisualisationModeEnum getLabelVisualisationMode() {
        return labelVisualisationMode;
    }

    public void setLabelVisualisationMode(LabelVisualisationModeEnum labelVisualisationMode) {
        this.labelVisualisationMode = labelVisualisationMode;
    }

    public List<String> getSelectedDimensionValues() {
        return selectedDimensionValues;
    }

    public void setSelectedDimensionValues(List<String> selectedDimensionValues) {
        this.selectedDimensionValues = selectedDimensionValues;
    }

    public Boolean getReversed() {
        return reversed;
    }

    public void setReversed(Boolean reversed) {
        this.reversed = reversed;
    }
}
