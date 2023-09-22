(function () {
    "use strict";

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Rectangle = App.Table.Rectangle,
        Utils = App.Table.Utils,
        Point = App.Table.Point;

    App.namespace("App.Table.LeftHeaderZone");

    App.Table.LeftHeaderZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    _.extend(App.Table.LeftHeaderZone.prototype, App.Table.Zone.prototype);

    App.Table.LeftHeaderZone.prototype.initialize = function (options) {
        if (!options) {
            options = {};
        }
        this.bodyZone = options.bodyZone;
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;
        this.view = options.view;
        this.calculateIncrementalSize();
    };

    App.Table.LeftHeaderZone.prototype.calculateIncrementalSize = function () {
        if (this.dataSource && this.delegate) {
            var self = this;
            var columnsLen = this.dataSource.leftHeaderColumns();

            var columns = Utils.acumulate(columnsLen, function (column) {
                return self.delegate.leftHeaderColumnWidth(column, self.view);
            });

            this.incrementalCellSize = {
                rows: this.bodyZone.incrementalCellSize.rows,
                columns: columns
            };

            var widthTotal = columns[columns.length - 1];
            var heightTotal = this.bodyZone.size.height;


            this.setSize(new Size(widthTotal, heightTotal));
        }
    };

    App.Table.LeftHeaderZone.prototype.paintInfo = function () {
        var bodyPaintInfo = this.bodyZone.paintInfo();

        var columnsLen = this.dataSource.leftHeaderColumns();
        var columnsValues = this.dataSource.leftHeaderValues();
        var tooltipValues = this.dataSource.leftHeaderTooltipValues();

        var columnsValuesLength = _.map(columnsValues, function (columnValue) {
            return columnValue.length;
        });

        // IDEA: Maybe this could be call only once
        var columnsValuesLengthAc = Utils.rightProductAcumulate(columnsValuesLength);

        var result = [];

        for (var i = 0; i < columnsLen; i++) {
            result[i] = [];
            var cellWidth = this.delegate.leftHeaderColumnWidth(i, this.view);
            var cellX = this.incrementalCellSize.columns[i];

            for (var j = 0; j < bodyPaintInfo.rows.length; j++) {
                var row = bodyPaintInfo.rows[j];

                var indexInValue = Math.floor(row.index / columnsValuesLengthAc[i]);
                var index = indexInValue * columnsValuesLengthAc[i];
                if (result[i].length === 0 || _.last(result[i]).index != index) {
                    var indexEnd = index + columnsValuesLengthAc[i];
                    var cellHeight = this.incrementalCellSize.rows[indexEnd] - this.incrementalCellSize.rows[index];

                    var rowIndex = indexInValue % columnsValuesLength[i];
                    var content = columnsValues[i][rowIndex] ? columnsValues[i][rowIndex].label : "";
                    var level = columnsValues[i][rowIndex] ? columnsValues[i][rowIndex].level : 0;

                    var associatedBodyCellWithAttributes = new Cell(0, row.indexCell);
                    var cellAttributesAtIndex = this.dataSource.cellAttributesAtIndex(associatedBodyCellWithAttributes);
                    var cellAttributes = [];
                    var cellTitle = "";
                    var cellDescription = "";
                    var cellMeasureUnit = "";
                    var cellUnitMultiplier = "";

                    var cellInfo = tooltipValues[i][rowIndex];
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

                    result[i].push({
                        index: index,
                        indexEnd: indexEnd,
                        height: cellHeight,
                        y: row.y,
                        x: cellX,
                        width: cellWidth,
                        content: content,
                        level: level,
                        tooltipTitle: cellTitle,
                        tooltipDescription: cellDescription,
                        tooltipMeasureUnit: cellMeasureUnit,
                        tooltipUnitMultiplier: cellUnitMultiplier,
                        attributes: cellAttributes
                    });
                }
            }
        }

        this.lastPaintInfo = result;
        return result;
    };

    App.Table.LeftHeaderZone.prototype.cellAtPoint = function (absolutePoint) {
        // IDEA: For optimizing this we can search for columns instead of all cells 
        return _.find(_.flatten(this.lastPaintInfo, true), function (headerCell) {
            var rect = new Rectangle(headerCell.x, headerCell.y, headerCell.width, headerCell.height);
            return rect.containsPoint(absolutePoint);
        });
    }

    App.Table.LeftHeaderZone.prototype.cellInfoAtPoint = function (absolutePoint) {
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

    App.Table.LeftHeaderZone.prototype.rowsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return _.range(headerCellAtPoint.index, headerCellAtPoint.indexEnd);
        }
    };

    App.Table.LeftHeaderZone.prototype.rowsCellsAtPoint = function (absolutePoint) {
        var headerCellAtPoint = this.cellAtPoint(absolutePoint);
        if (headerCellAtPoint) {
            return _.range(headerCellAtPoint.index - this.dataSource.blankRowsOffset(headerCellAtPoint.index),
                headerCellAtPoint.indexEnd - this.dataSource.blankRowsOffset(headerCellAtPoint.index));
        }
    };

    App.Table.LeftHeaderZone.prototype.getCanvasWidth = function () {
        return this.view.canvas.width - this.delegate.scrollSize;
    },

        App.Table.LeftHeaderZone.prototype.repaint = function () {
            this.clear();

            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.getCanvasWidth() + 0.5, this.viewPort.height);
            this.ctx.clip();

            var paintInfo = this.paintInfo();
            this.paintCells(paintInfo);

            this.ctx.restore();
            this.needRepaint = false;
        };

    App.Table.LeftHeaderZone.prototype.paintCells = function (paintInfo) {
        this.ctx.save();

        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "left";

        var margin = this.delegate.style.headerCell.margin.left;

        for (var i = 0; i < paintInfo.length; i++) {
            var row = paintInfo[i];

            for (var j = 0; j < row.length; j++) {
                this.ctx.strokeStyle = this.delegate.style.headerCell.border.color.default;
                this.ctx.lineWidth = this.delegate.style.headerCell.border.width.default;
                this.ctx.font = this.delegate.style.headerCell.font.default;

                var cell = row[j];
                var isBlankRow = this.dataSource.isBlankRow(cell.index);
                var previousIsBlankRow = row[j - 1] ? this.dataSource.isBlankRow(row[j - 1].index) : true;

                this.ctx.save();

                var cellWidth = cell.width;

                if (isBlankRow) {
                    cellWidth = this.getCanvasWidth();
                }

                this.ctx.beginPath();
                this.ctx.rect(cell.x, cell.y, cellWidth, cell.height);
                this.ctx.clip();

                // Inner cell
                this.ctx.beginPath();
                if (isBlankRow) {
                    this.ctx.lineWidth = this.delegate.style.headerCell.border.width.mainLevel;
                    this.ctx.strokeStyle = this.delegate.style.headerCell.border.color.mainLevel;
                    if (previousIsBlankRow) {
                        drawCellWithBottomBorder(this.ctx);
                    } else {
                        drawCellWithBothBorders(this.ctx);
                    }
                } else {
                    drawCellWithoutBorders(this.ctx);
                }
                this.ctx.fillStyle = this.delegate.style.headerCell.background(cell, this.view, true);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();

                // Text
                switch (cell.level) {
                    case 0:
                        this.ctx.font = this.delegate.style.headerCell.font.mainLevel;
                        break;
                    case 1:
                        this.ctx.font = this.delegate.style.headerCell.font.secondLevel;
                        break;
                    default:
                        break;
                }
                this.ctx.fillStyle = this.delegate.style.headerCell.color;
                this.ctx.fillText(cell.content || "", cell.x + margin, cell.y + margin);

                // Attributes triangle
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

        function drawCellWithBothBorders(ctx) {
            ctx.rect(cell.x, cell.y + 1, cellWidth, cell.height - 2);
        }
        function drawCellWithoutBorders(ctx) {
            ctx.rect(cell.x, cell.y, cellWidth - ctx.lineWidth, cell.height);
        }
        function drawCellWithBottomBorder(ctx) {
            ctx.rect(cell.x, cell.y, cellWidth, cell.height - 1);
        }
    };

    App.Table.LeftHeaderZone.prototype.separatorIndexInRectangle = function (rectangle) {
        for (var i = 0; i < this.incrementalCellSize.columns.length; i++) {
            var incrementalColumnSize = this.incrementalCellSize.columns[i];
            if (rectangle.containsPoint(new Point(incrementalColumnSize + this.viewPort.x, rectangle.y))) {
                return i;
            }
        }
    }

}());