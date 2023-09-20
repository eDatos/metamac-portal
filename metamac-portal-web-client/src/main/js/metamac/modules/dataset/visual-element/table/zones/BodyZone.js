(function () {
    "use strict";

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Point = App.Table.Point,
        Utils = App.Table.Utils,
        Rectangle = App.Table.Rectangle;

    App.namespace("App.Table.BodyZone");

    App.Table.BodyZone = function (options) {
        App.Table.Zone.prototype.initialize.apply(this, arguments);
        this.initialize(options);
    };

    App.Table.BodyZone.prototype = {
        initialize: function (options) {
            if (!options) {
                options = {};
            }
            this.dataSource = options.dataSource;
            this.delegate = options.delegate;
            this.view = options.view;
            this.valuesToIgnore = [];
            this.valuesToIgnoreHandlers = {
                'NULL': function(value) {
                    return value == null
                },
                'ZERO': function(value) {
                    return value === 0;
                }
            }
            this.calculateIncrementalSize();
        },

        // Calcula en que posición empieza cada una de las filas y columnas
        // y el tamaño total
        calculateIncrementalSize: function () {
            if (this.dataSource && this.delegate) {
                var self = this;
                var rowsLen = this.dataSource.rows(),
                    columnsLen = this.dataSource.columns();

                var rows = Utils.acumulate(rowsLen, function (row) {
                    return self.delegate.rowHeight(row);
                });
                var columns = Utils.acumulate(columnsLen, function (column) {
                    return self.delegate.columnWidth(column);
                });

                this.incrementalCellSize = {
                    rows: rows,
                    columns: columns
                };

                this.calculateSize();
            }
        },

        calculateSize: function() {
            this.ignoredCells = this.calculateIgnoredCells();
            var widthTotal = 0;
            var heightTotal = 0;
            var columns = this.incrementalCellSize.columns;
            var rows = this.incrementalCellSize.rows;
            if (this.ignoredCells) {
                widthTotal = columns[columns.length - 1 - Object.keys(this.ignoredCells.columns).length];
                heightTotal = rows[rows.length - 1 - Object.keys(this.ignoredCells.rows).length];
            } else {
                widthTotal = columns[columns.length - 1];
                heightTotal = rows[rows.length - 1];
            }
            this.setSize(new Size(widthTotal, heightTotal));
        },

        createRowsTree: function(finalLevelIndices, levelsLengths, levelsLengthsAc) {
            var rowsTree = {};
            for (var i = 0; i < finalLevelIndices.length; i++) {
                var finalLevelIndex = finalLevelIndices[i];
                var branch = rowsTree;
                for (var j = 0; j < levelsLengths.length - 1; j++) {
                    var levelIndex = Math.floor(finalLevelIndex / levelsLengthsAc[j]) % levelsLengths[j];
                    if (!branch.hasOwnProperty(levelIndex)) {
                        branch[levelIndex] = {}
                    }
                    branch = branch[levelIndex];
                }
                branch[finalLevelIndex % levelsLengths[ levelsLengths.length - 1]] = finalLevelIndex;
            }
            return rowsTree;
        },


        /* BEGIN section Ignore functions */

        calculateIgnoredRows: function(rowsTree, numberLevels, ignoredRows, rowLevel, absoluteIndexParent) {
            rowLevel = rowLevel || 0;
            ignoredRows = ignoredRows || {};
            absoluteIndexParent = absoluteIndexParent || 0;
            var self = this;

            Object.keys(rowsTree).forEach(function(rowKey) {
                rowKey = Number(rowKey);
                if (typeof rowsTree[rowKey] === 'object') {
                    var absoluteIndex = absoluteIndexParent + self.dataSource.leftHeaderDimensionsElements(rowLevel + 1) * rowKey + (rowLevel? 1 : 0);
                    if (self.shouldIgnoreBlankRow(rowsTree[rowKey], numberLevels, rowLevel + 1)) {
                        ignoredRows[absoluteIndex] = {
                            absoluteIndex: absoluteIndex,
                            indexCell: _.range(numberLevels - rowLevel).reduce(function(indexCell) {
                                return (typeof indexCell == 'object')? indexCell[Object.keys(indexCell)[0]] : indexCell;
                            }, rowsTree[rowKey]),
                            blank: true,
                            rowLevel: rowLevel
                        };
                    }
                    self.calculateIgnoredRows(rowsTree[rowKey], numberLevels, ignoredRows, rowLevel + 1, absoluteIndex);
                } else {
                    ignoredRows[absoluteIndexParent + rowKey + rowLevel] = {
                        absoluteIndex: absoluteIndexParent + rowKey + rowLevel,
                        indexCell: rowsTree[rowKey],
                        blank: false,
                        rowLevel: rowLevel
                    };
                }
            });

            return ignoredRows;
        },

        shouldIgnoreBlankRow: function(rowsBranchTree, numberLevels, currentLevel) {
            currentLevel = currentLevel || 0;
            var self = this;
            var childs = Object.keys(rowsBranchTree);
            var totalChilds = self.dataSource.leftHeaderDimensionsElements(currentLevel) - 1;
            if (currentLevel == numberLevels - 1) {
                return childs.length == totalChilds;
            }
            else if (currentLevel < numberLevels - 1) {
                var ignoredChilds = 0;
                childs.forEach(function(rowKey) {
                    if (self.shouldIgnoreBlankRow(rowsBranchTree[rowKey], numberLevels, currentLevel + 1)) {
                        ignoredChilds++;
                    }
                })
                return ignoredChilds == totalChilds;
            }
        },

        shouldIgnore: function(value) {
            for (var i = 0; i < this.valuesToIgnore.length; i++) {
                if (this.valuesToIgnoreHandlers[this.valuesToIgnore[i]] && this.valuesToIgnoreHandlers[this.valuesToIgnore[i]](value)) {
                    return true;
                }
            }
            return false;
        },

        shouldIgnoreCells: function() {
            return this.valuesToIgnore && this.valuesToIgnore.length > 0;
        },

        shouldIgnoreRow: function(iRow) {
            var totalColumns = this.dataSource.columns();
            for (var i = 0; i < totalColumns; i++) {
                var value = this.dataSource.valueAtIndex(new Cell(i, iRow));
                if (!this.shouldIgnore(value)) {
                    return false;
                }
            }
            return true;
        },

        shouldIgnoreColumn: function(iColumn) {
            var leftHeadersLengths = this.dataSource.leftHeaderDimensionsLengths();
            var rowsWithvalue = leftHeadersLengths.reduce(function(dimensionsRows, dimensionRows){ return dimensionsRows * dimensionRows }, 1);
            for (var i = 0; i < rowsWithvalue; i++) {
                var value = this.dataSource.valueAtIndex(new Cell(iColumn, i));
                if (!this.shouldIgnore(value)) {
                    return false;
                }
            }
            return true;
        },

        calculateIgnoredCells: function() {
            if (!this.shouldIgnoreCells()) {
                return null;
            }

            var ignoredCells = {
                columns: {},
                rows: {}
            }
            var totalColumns = this.dataSource.columns();
            var leftHeadersLengths = this.dataSource.leftHeaderDimensionsLengths();
            var rowsWithvalue = leftHeadersLengths.reduce(function(dimensionsRows, dimensionRows ){ return dimensionsRows * dimensionRows }, 1);
            var ignoredRowsWithValues = [];
            
            for (var i = 0; i < totalColumns; i++) {
                if (this.shouldIgnoreColumn(i)) {
                    ignoredCells.columns[i] =  true;
                }
            }

            for (var i = 0; i < rowsWithvalue; i++) {
                if (this.shouldIgnoreRow(i)) {
                    ignoredRowsWithValues.push(i);
                }
            }
            var leftHeadersAc = Utils.rightProductAcumulate(leftHeadersLengths)
            var rowsTree = this.createRowsTree(ignoredRowsWithValues, leftHeadersLengths, leftHeadersAc);
            ignoredCells.rows = this.calculateIgnoredRows(rowsTree, leftHeadersLengths.length);

            ignoredCells.columnsKeys = Object.keys(ignoredCells.columns).map(function(key) {return Number(key)});
            ignoredCells.rowsKeys = Object.keys(ignoredCells.rows).map(function(key) {return Number(key)});
            return ignoredCells;
        },

        recalculateIgnoredValues: function(valuesToIgnore) {
            this.valuesToIgnore = valuesToIgnore;
            this.calculateSize();
        },

        /* END section Ignore functions */
        
        
        // Calcula la primera celda visible (en la esquina superior izquierda)
        firstCell: function () {
            var x = Utils.floorIndex(this.incrementalCellSize.columns, this.origin.x),
                y = Utils.floorIndex(this.incrementalCellSize.rows, this.origin.y);
            return new Cell(x, y);
        },

        cell2AbsolutePoint: function (cell) {
            var x = this.incrementalCellSize.columns[cell.x],
                y = this.incrementalCellSize.rows[cell.y];
            return new Point(x, y);
        },

        cellAtPoint: function (point) {
            var iX = Utils.floorIndex(this.currentPaintInfo.columns.map(function(c) { return c.x}), point.x);
            var iY = Utils.floorIndex(this.currentPaintInfo.rows.map(function(r){return r.y}), point.y);

            var x = this.currentPaintInfo.columns[iX].index;
            var y = this.currentPaintInfo.rows[iY].indexCell;
            return new Cell(x, y);
        },

        cellSize: function (cell) {
            var width = this.delegate.columnWidth(cell.x);
            var height = this.delegate.rowHeight(cell.y);
            return new Size(width, height);
        },

        isCellVisible: function (cell) {
            if (!this.dataSource.cellExists(cell)) {
                return false;
            }
            var size = this.cellSize(cell);
            var topLeft = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(cell));

            var cellRectangle = new Rectangle(topLeft, size);
            return this.isRelativeRectangleVisible(cellRectangle);
        },

        visibleRowsAndColumns: function () {
            var xVisible = true,
                yVisible = true;
            var firstCell = this.firstCell();

            var xCell = firstCell.clone();
            while (xVisible) {
                xCell.x = xCell.x + 1;
                xVisible = this.isCellVisible(xCell);
            }

            var yCell = firstCell.clone();
            while (yVisible) {
                yCell.y = yCell.y + 1;
                yVisible = this.isCellVisible(yCell);
            }
            return {
                rows: {
                    begin: firstCell.y,
                    end: yCell.y
                },
                columns: {
                    begin: firstCell.x,
                    end: xCell.x
                }
            };
        },

        paintInfo: function () {
            var xVisible = true,
                yVisible = true;

            var totalRows = this.dataSource.rows();
            var totalColumns = this.dataSource.columns();

            var relativeFirstCell = this.firstCell();
            var absoluteFirstCell = relativeFirstCell;
            var firstCellPoint = this.absolutePoint2RelativePoint(this.cell2AbsolutePoint(relativeFirstCell));

            var columns = [], rows = [];

            if (this.ignoredCells) {
                // We need to recalculate the offset for the first column in case it is ignored
                var iColumn = absoluteFirstCell.x;
                var ignoredOffset = _.sortedIndex(this.ignoredCells.columnsKeys, iColumn);
                var offset = 0;

                if (this.ignoredCells.columns.hasOwnProperty(iColumn)) {
                    ignoredOffset++;
                }
                
                while (offset < ignoredOffset && iColumn < totalRows) {
                    if (!this.ignoredCells.columns.hasOwnProperty(++iColumn)) {
                        offset++;
                    }
                }
                
                // We need to recalculate the offset for the first row in case it is ignored
                var iRow = absoluteFirstCell.y;
                var ignoredRowsOffset = _.sortedIndex(this.ignoredCells.rowsKeys, iRow);
                offset = 0;

                if (this.ignoredCells.rows.hasOwnProperty(iRow)) {
                    ignoredRowsOffset++;
                }
                while (offset < ignoredRowsOffset && iRow < totalRows) {
                    if (!this.ignoredCells.rows.hasOwnProperty(++iRow)) {
                        offset++;
                    }
                }
                absoluteFirstCell = {
                    x: iColumn,
                    y: iRow
                }
            }

            var firstCellSize = this.cellSize(absoluteFirstCell);
            var j = absoluteFirstCell.x;
            var relativeJ = relativeFirstCell.x;
            var x = firstCellPoint.x;
            var size;

            while (xVisible && j < totalColumns) {
                if (this.ignoredCells && this.ignoredCells.columns.hasOwnProperty(j)) {
                    j++;
                    continue;
                }

                size = this.delegate.columnWidth(relativeJ);

                columns.push({
                    x: x,
                    index: j,
                    width: size,
                    relativeIndex: relativeJ++
                });

                j = j + 1;
                x = x + size;

                xVisible = this.isRelativeRectangleVisible(new Rectangle(x, firstCellPoint.y, size, firstCellSize.height));
            }

            var i = absoluteFirstCell.y;
            var y = firstCellPoint.y;
            // IndexCell to account for the difference that blank rows add
            var indexCell = i - this.dataSource.blankRowsOffset(i);
            
            while (yVisible && i < totalRows) {
                if (this.ignoredCells && this.ignoredCells.rows.hasOwnProperty(i)) {
                    if (!this.ignoredCells.rows[i].blank) {
                        indexCell++;
                    }
                    i++;
                    continue;
                }

                size = this.delegate.rowHeight(i);

                rows.push({
                    y: y,
                    index: i,
                    indexCell: indexCell,
                    height: size,
                    blank: this.dataSource.isBlankRow(i)
                });

                if (!this.dataSource.isBlankRow(i)) {
                    indexCell++;
                }

                i = i + 1;
                y = y + size;

                yVisible = this.isRelativeRectangleVisible(new Rectangle(firstCellPoint.x, y, firstCellSize.width, size));
            }

            return {
                rows: rows,
                columns: columns
            };
        },

        repaint: function () {
            this.clear();
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height);
            this.ctx.clip();

            var paintInfo = this.paintInfo();
            this.currentPaintInfo = paintInfo;

            this.paintCells(paintInfo);

            this.ctx.restore();
            this.needRepaint = false;
        },

        getPaintInfoRowCell: function (y) {
            var nonBlankRows = _(this.paintInfo().rows)
                .filter(function (row) {
                    return !row.blank;
                });
            return nonBlankRows[y];
        },

        paintCells: function (paintInfo) {
            var x, y, bgColor, i, j;

            this.ctx.textAlign = "right";
            this.ctx.font = this.delegate.style.bodyCell.font;
            this.ctx.textBaseline = "middle";
            this.ctx.strokeStyle = this.delegate.style.bodyCell.border.color;

            var marginRight = this.delegate.style.bodyCell.margin.right;

            for (j = 0; j < paintInfo.columns.length; j++) {
                var column = paintInfo.columns[j];
                for (i = 0; i < paintInfo.rows.length; i++) {
                    var row = paintInfo.rows[i];
                    var cell = new Cell(column.index, row.indexCell);
                    var point = new Point(column.x, row.y);
                    var size = new Size(column.width, row.height);

                    this.ctx.beginPath();
                    this.ctx.rect(point.x, point.y, size.width, size.height);
                    if (_.isFunction(this.delegate.style.bodyCell.background)) {
                        bgColor = this.delegate.style.bodyCell.background(cell, this.view);
                    } else {
                        bgColor = this.delegate.style.bodyCell.background;
                    }
                    this.ctx.fillStyle = bgColor;
                    this.ctx.fill();
                    this.ctx.closePath();

                    var isLastRow = i == (paintInfo.rows.length - 1);
                    if (isLastRow) {
                        this.ctx.beginPath();
                        this.ctx.lineWidth = this.delegate.style.bodyCell.border.width;
                        this.ctx.moveTo(point.x - 1, point.y + size.height);
                        this.ctx.lineTo(point.x + size.width, point.y + size.height);
                        this.ctx.stroke();
                    }

                    var value = "";
                    if (!row.blank) {
                        value = this.dataSource.cellAtIndex(cell);

                        if (_.isFunction(this.delegate.format)) {
                            value = this.delegate.format(value);
                        }

                        if (this.dataSource.cellHasPrimaryAttributes(cell)) {
                            this.ctx.beginPath();
                            var marginMark = this.delegate.style.attributeCellMark.margin;
                            var sizeMark = this.delegate.style.attributeCellMark.size;
                            this.ctx.moveTo(point.x + size.width - marginMark, point.y + size.height - marginMark);
                            this.ctx.lineTo(point.x + size.width - marginMark - sizeMark, point.y + size.height - marginMark);
                            this.ctx.lineTo(point.x + size.width - marginMark, point.y + size.height - marginMark - sizeMark);
                            this.ctx.fillStyle = this.delegate.style.attributeCellMark.background;
                            this.ctx.fill();
                            this.ctx.closePath();
                        }
                    }

                    if (value !== undefined) {
                        this.ctx.fillStyle = this.delegate.style.bodyCell.color;
                        this.ctx.fillText(value, point.x + size.width - marginRight, point.y + size.height / 2);
                    }
                }
            }
        },

        cellInfoAtPoint: function (absolutePoint) {
            var bodyCellAtPoint = this.cellAtPoint(absolutePoint);
            if (bodyCellAtPoint) {
                return this.delegate.formatCellInfo(this.dataSource.cellInfoAtIndex(bodyCellAtPoint));
            }
        },

        cellTimeSerieAtPoint: function (absolutePoint) {
            var bodyCellAtPoint = this.cellAtPoint(absolutePoint);
            if (bodyCellAtPoint) {
                return this.dataSource.getCellTimeSerieAtIndex(bodyCellAtPoint);
            }
        },

        getCellInfoUnitMeasureMultiplier: function (absolutePoint) {
            var bodyCellAtPoint = this.cellAtPoint(absolutePoint);
            if (bodyCellAtPoint) {
                var cellInfo = this.dataSource.cellInfoAtIndex(bodyCellAtPoint);
                var measureUnit = this.delegate.formatMeasureUnit(cellInfo.measureUnit, cellInfo.attributes.dimensionsAttributes);
                var unitMultiplier = this.delegate.formatUnitMultiplier(cellInfo.unitMultiplier, cellInfo.attributes.dimensionsAttributes);
                return App.DimensionsUtils.getUnitMultiplierAndUnitMeasureLabel(measureUnit, unitMultiplier);
            } 
        }

    }

    _.defaults(App.Table.BodyZone.prototype, App.Table.Zone.prototype);
}());

