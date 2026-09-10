package org.siemac.metamac.portal.dto;

public class Chapter
    extends CollectionNode
{

    protected boolean opening;
    protected CollectionNodes nodes;

    /**
     * Gets the value of the opening property.
     *
     */
    public boolean getOpening() {
        return opening;
    }

    /**
     * Sets the value of the opening property.
     *
     */
    public void setOpening(boolean value) {
        this.opening = value;
    }

    /**
     * Gets the value of the nodes property.
     * 
     * @return
     *     possible object is
     *     {@link CollectionNodes }
     *     
     */
    public CollectionNodes getNodes() {
        return nodes;
    }

    /**
     * Sets the value of the nodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link CollectionNodes }
     *     
     */
    public void setNodes(CollectionNodes value) {
        this.nodes = value;
    }

}
