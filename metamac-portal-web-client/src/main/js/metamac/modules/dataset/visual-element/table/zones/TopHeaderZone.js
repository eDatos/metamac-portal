(function () {
    "use strict";

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Rectangle = App.Table.Rectangle,
        Utils = App.Table.Utils,
        Point = App.Table.Point;

    App.namespace("App.Table.TopHeaderZone");

    App.Table.TopHeaderZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(App.Table.TopHeaderZone.prototype, App.Table.Zone.prototype);

    App.Table.TopHeaderZone.prototype.initialize = function (options) {
        if (!options) {
            options = {};
        }
        this.bodyZone = options.bodyZone;
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;
        this.view = options.view;
        this.offset = new Point(0, 0);
        this.calculateIncrementalSize();
    };

    App.Table.TopHeaderZone.prototype.setOffset = function (offset) {
        this.offset = offset;
    }

    App.Table.TopHeaderZone.prototype.calculateIncrementalSize = function () {
        if (this.dataSource && this.delegate) {
            var self = this;
            var rowsLen = this.dataSource.topHeaderRows();

            var rows = Utils.acumulate(rowsLen, function (row) {
                return self.delegate.topHeaderRowHeight(row, self.view);
            });

            this.incrementalCellSize = {
                rows: rows,
                columns: this.bodyZone.incrementalCellSize.columns
            };

            var heightTotal = rows[rows.length - 1];
            var widthTotal = this.bodyZone.size.width;

            this.setSize(new Size(widthTotal, heightTotal));
        }
    };

    App.Table.TopHeaderZone.prototype.paintInfo = function() {
        var bodyPaintInfo = this.bodyZone.paintInfo();

        var rowsLen = this.dataSource.topHeaderRows();
        var rowsValues = this.dataSource.topHeaderValues();

        var rowsValuesLength = _.map(rowsValues, function (rowValue) {
            return rowValue.length;
        });
        var rowsValuesLengthAc = Utils.rightProductAcumulate(rowsValuesLength);
        var columnsTree = {};
        for (var i = 0; i < bodyPaintInfo.columns.length; i++) {
            var column = bodyPaintInfo.columns[i];
            var index = column.index;
            var pointerColumn = columnsTree;
            for (var j = 0; j < rowsLen - 1; j++) {
                var columnIndex = Math.floor(index / rowsValuesLengthAc[j]) % rowsValues[j].length;
                if (!pointerColumn.hasOwnProperty(columnIndex)) {
                    pointerColumn[columnIndex] = {}
                }
                pointerColumn = pointerColumn[columnIndex];
            }
            pointerColumn[index % rowsValues[rowsValues.length - 1].length] = i;
        }

        var paintInfo = [];
        this.calculateColumns(bodyPaintInfo, columnsTree, paintInfo);
        this.lastPaintInfo = paintInfo;
        return paintInfo;
    }

    App.Table.TopHeaderZone.prototype.calculateColumns = function (bodyPaintInfo, columnsTree, paintInfo, columnLevel, offsets) {
        columnLevel = columnLevel || 0;
        offsets = offsets || {};
        offsets[columnLevel] = offsets[columnLevel] || 0;
        var tooltipValues = this.dataSource.topHeaderTooltipValues();
        var rowsValues = this.dataSource.topHeaderValues();
        var self = this;
        paintInfo[columnLevel] = paintInfo[columnLevel] || [];

        Object.keys(columnsTree).forEach(function(columnKey) {
            var cellResult = {};
            var associatedBodyCellWithAttributes;

            if (typeof columnsTree[columnKey] == 'object') { // Is column with childs
                self.calculateColumns(bodyPaintInfo, columnsTree[columnKey], paintInfo, columnLevel + 1, offsets);
                var offset = offsets[columnLevel];
                var offsetEnd = offset + Object.keys(columnsTree[columnKey]).length;
                var visibleChilds = paintInfo[columnLevel + 1].slice(offset, offsetEnd);
                offsets[columnLevel] = offsetEnd;

                var firstChild = visibleChilds[0];
                var lastChild = visibleChilds[visibleChilds.length -1 ];
                associatedBodyCellWithAttributes = new Cell(firstChild.index, 0);
                
                var resultx = firstChild.x < 0 ? 0 : firstChild.x;

                cellResult = {
                    width: (lastChild.x + lastChild.width) - resultx,
                    index: firstChild.index,
                    indexEnd: lastChild.indexEnd,
                    relativeIndex: firstChild.relativeIndex,
                    relativeIndexEnd: lastChild.relativeIndexEnd,
                    x: resultx
                }

            } else {
                var column = bodyPaintInfo.columns[columnsTree[columnKey]];
                associatedBodyCellWithAttributes = new Cell(column.index, 0);
                var topHeaderZoneWidth = self.viewPort.width + self.offset.x;
                cellResult = {
                    width: (column.x + column.width > topHeaderZoneWidth)? topHeaderZoneWidth - column.x : column.width,
                    index: column.index,
                    indexEnd: column.index + 1,
                    x: column.x,
                    relativeIndex: column.relativeIndex,
                    relativeIndexEnd: column.relativeIndex + 1
                }
            }

            var cellAttributesAtIndex = self.dataSource.cellAttributesAtIndex(associatedBodyCellWithAttributes);
            var cellAttributes = [];
            var cellTitle = "";
            var cellDescription = "";
            var cellMeasureUnit = "";
            var cellUnitMultiplier = "";
            var cellInfo = tooltipValues[columnLevel][columnKey];

            if (cellInfo) {
                cellAttributes = cellAttributesAtIndex ? cellAttributesAtIndex.dimensionsAttributes : [];
                cellAttributes = _.filter(cellAttributes, function (cellAttribute) {
                    return cellAttribute.dimensionId == cellInfo.dimensionId;
                });
                if (!_.compact(_.pluck(cellAttributes, 'value')).length) {
                    cellAttributes = [];
                }
                cellTitle = cellInfo.title;
                cellDescription = cellInfo.description;
                cellMeasureUnit = cellInfo.measureUnit;
                cellUnitMultiplier = cellInfo.unitMultiplier;
            }

            paintInfo[columnLevel].push(_.extend(cellResult, {
                y: self.incrementalCellSize.rows[columnLevel],
                height: self.delegate.topHeaderRowHeight(columnLevel, self.view),
                content: rowsValues[columnLevel][columnKey],
                tooltipTitle: cellTitle,
                tooltipDescription: cellDescription,
                tooltipMeasureUnit: cellMeasureUnit,
                tooltipUnitMultiplier: cellUnitMultiplier,
                attributes: cellAttributes
            }));
        })
        
    }

    App.Table.TopHeaderZone.prototype.cellAtPoint = function (absolutePoint) {
        // Optimizable no buscando por todas las celdas, sino buscar por columnas
        return _.find(_.flatten(this.lastPaintInfo, true), function (headerCell) {
            var rect = new Rectangle(headerCell.x, headerCell.y, headerCell.width, headerCell.height);
            return rect.containsPoint(absolutePoint);
        });
    }

    App.Table.TopHeaderZone.prototype.cellInfoAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return this.delegate.formatHeaderInfo({
                title: headerCellAtPoint.tooltipTitle,
                description: headerCellAtPoint.tooltipDescription,
                measureUnit: headerCellAtPoint.tooltipMeasureUnit,
                unitMultiplier: headerCellAtPoint.tooltipUnitMultiplier,
                attributes: headerCellAtPoint.attributes
            });
        }
    };

    App.Table.TopHeaderZone.prototype.columnsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return _.range(headerCellAtPoint.index, headerCellAtPoint.indexEnd);
        }
    };

    App.Table.TopHeaderZone.prototype.repaint = function () {
        this.clear();
        this.paintShadow();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + this.offset.x, this.viewPort.height);
        this.ctx.clip();

        var paintInfo = this.paintInfo();
        this.paintCells(paintInfo);
        this.paintGrid();
        this.ctx.restore();

        this.needRepaint = false;
    };

    App.Table.TopHeaderZone.prototype.paintShadow = function () {
        if (this.delegate.style.headerCell.shadow.show && this.bodyZone.origin.y !== 0) {
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + 0.5 + this.offset.x, this.viewPort.height + 30);
            this.ctx.clip();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width + this.offset.x, this.viewPort.height + 0.5);
            this.ctx.shadowColor = this.delegate.style.headerCell.shadow.color;
            this.ctx.shadowBlur = this.delegate.style.headerCell.shadow.blur;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = this.delegate.style.headerCell.shadow.offset;
            this.ctx.fill();

            this.ctx.restore();
        }
    };

    App.Table.TopHeaderZone.prototype.paintGrid = function () {
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color.mainLevel;
        this.ctx.lineWidth = this.delegate.style.headerCell.border.width.mainLevel;

        this.ctx.rect(
            this.viewPort.x - this.ctx.lineWidth,
            this.viewPort.y,
            this.viewPort.width + this.ctx.lineWidth * 2 + this.offset.x,
            this.viewPort.height
        );

        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    };

    App.Table.TopHeaderZone.prototype.paintCells = function (paintInfo) {
        this.ctx.save();

        this.ctx.lineWidth = this.delegate.style.headerCell.border.width.default;
        this.ctx.strokeStyle = this.delegate.style.headerCell.border.color.default;
        this.ctx.font = this.delegate.style.headerCell.font.default;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "left";

        var margin = this.delegate.style.headerCell.margin.left;
        for (var i = 0; i < paintInfo.length; i++) {
            var row = paintInfo[i];

            for (var j = 0; j < row.length; j++) {
                var cell = row[j];

                this.ctx.save();

                this.ctx.beginPath();
                this.ctx.rect(cell.x, cell.y, cell.width + 0.5, cell.height + 0.5);
                this.ctx.clip();

                this.ctx.beginPath();
                this.ctx.rect(cell.x + 0.5, cell.y + 0.5, cell.width, cell.height);

                this.ctx.fillStyle = this.delegate.style.headerCell.background(cell, this.view, false);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.fillStyle = this.delegate.style.headerCell.color;
                this.ctx.fillText(cell.content || "", cell.x + margin, Math.ceil(cell.y + cell.height / 2));
                if (cell.attributes.length) {
                    this.ctx.beginPath();
                    var marginMark = this.delegate.style.attributeCellMark.margin;
                    var sizeMark = this.delegate.style.attributeCellMark.size;
                    this.ctx.moveTo(cell.x + cell.width - marginMark, cell.y + cell.height - marginMark);
                    this.ctx.lineTo(cell.x + cell.width - marginMark - sizeMark, cell.y + cell.height - marginMark);
                    this.ctx.lineTo(cell.x + cell.width - marginMark, cell.y + cell.height - marginMark - sizeMark);
                    this.ctx.fillStyle = this.delegate.style.attributeCellMark.background;
                    this.ctx.fill();
                    this.ctx.closePath();
                }

                this.ctx.restore();
            }
        }
        this.ctx.restore();
    };

    App.Table.TopHeaderZone.prototype.separatorIndexInRectangle = function (rectangle) {
        if (!this.lastPaintInfo) {
            this.paintInfo();
        }
        var lastRowPaintInfo = _.last(this.lastPaintInfo);

        for (var i = 0; i < lastRowPaintInfo.length; i++) {
            var cellPaintInfo = lastRowPaintInfo[i];
            if (rectangle.containsPoint(new Point(cellPaintInfo.x, rectangle.y))) {
                return cellPaintInfo.relativeIndex;
            } else if (rectangle.containsPoint(new Point(cellPaintInfo.x + cellPaintInfo.width, rectangle.y))) {
                return cellPaintInfo.relativeIndexEnd;
            }
        }
    }

    App.Table.TopHeaderZone.prototype.containsPoint = function (point) {
        var offsettedViewport = new Rectangle(
            this.viewPort.x,
            this.viewPort.y,
            this.viewPort.width + this.offset.x,
            this.viewPort.height
        );
        return offsettedViewport.containsPoint(point);
    }

}());