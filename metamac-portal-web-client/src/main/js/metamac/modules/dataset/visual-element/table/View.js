(function () {
    "use strict";

    App.namespace("App.Table.View");

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Point = App.Table.Point,
        BodyZone = App.Table.BodyZone,
        RightScrollZone = App.Table.RightScrollZone,
        BottonScrollZone = App.Table.BottomScrollZone,
        LeftHeaderZone = App.Table.LeftHeaderZone,
        TopHeaderZone = App.Table.TopHeaderZone,
        Rectangle = App.Table.Rectangle,
        SpinnerZone = App.Table.SpinnerZone,
        Tooltip = App.components.tooltip.Tooltip;

    App.Table.View = function (options) {
        if (_.isString(options.el)) {
            this.canvas = document.getElementById(options.el);
        } else if (options.canvas) {
            this.canvas = options.canvas;
        }
        this.$canvas = $(this.canvas);
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;

        if (this.canvas && this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.selection = {
            rows: [],
            rowsCells: [],
            columns: []
        };

        this.initializeZones();
        this.initializeClickTooltip();
    };

    App.Table.View.prototype.initializeZones = function () {

        this.scrollSize = this.delegate.scrollSize;
        this.spinnerSize = this.delegate.spinnerSize;

        this.bodyZone = new BodyZone({ context: this.ctx, dataSource: this.dataSource, delegate: this.delegate, view: this });

        this.leftHeaderZone = new LeftHeaderZone({ context: this.ctx, bodyZone: this.bodyZone, dataSource: this.dataSource, delegate: this.delegate, view: this });
        this.topHeaderZone = new TopHeaderZone({ context: this.ctx, bodyZone: this.bodyZone, dataSource: this.dataSource, delegate: this.delegate, view: this });
        this.rightScrollZone = new RightScrollZone({ context: this.ctx, bodyZone: this.bodyZone, delegate: this.delegate, view: this });
        this.bottomScrollZone = new BottonScrollZone({ context: this.ctx, bodyZone: this.bodyZone, delegate: this.delegate, view: this });

        if (this.spinnerZone) {
            this.spinnerZone.destroy();
        }

        this.spinnerZone = new SpinnerZone({ context: this.ctx });
        this.spinnerZone.setSize(this.spinnerSize);

        this.setZonesViewPorts();

        this.zones = [this.bodyZone, this.rightScrollZone, this.bottomScrollZone, this.leftHeaderZone, this.topHeaderZone];
    };

    App.Table.View.prototype.filterDimensionsByValues = function(valuesToIgnore) {
        this.bodyZone.recalculateIgnoredValues(valuesToIgnore);
        this.forceRepaint();
    };

    App.Table.View.prototype.getSize = function () {
        return new Size(this.canvas.width, this.canvas.height);
    };

    App.Table.View.prototype.setZonesViewPorts = function () {

        var canvasSize = this.getSize();

        // Volver a calcular los tamaño para permitir la redimensión de la cabecera en fullscreen
        this.leftHeaderZone.calculateIncrementalSize();
        this.topHeaderZone.calculateIncrementalSize();
        this.bodyZone.calculateIncrementalSize();

        //Configurar los viewports
        this.leftHeaderZone.setViewPort(
            new Rectangle(
                0,
                this.topHeaderZone.size.height,
                this.leftHeaderZone.size.width,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.topHeaderZone.setViewPort(
            new Rectangle(
                0,
                0,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                this.topHeaderZone.size.height
            )
        );
        this.topHeaderZone.setOffset(new Point(this.leftHeaderZone.size.width, 0));

        this.bodyZone.setViewPort(
            new Rectangle(
                this.leftHeaderZone.size.width,
                this.topHeaderZone.size.height,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.rightScrollZone.setViewPort(
            new Rectangle(
                canvasSize.width - this.scrollSize,
                this.topHeaderZone.size.height,
                this.scrollSize,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.bottomScrollZone.setViewPort(
            new Rectangle(
                this.leftHeaderZone.size.width,
                this.bodyZone.viewPort.bottomLeftPoint().y,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                this.scrollSize
            )
        );

        this.spinnerZone.setViewPort(
            new Rectangle(
                this.bodyZone.viewPort.bottomRightPoint().x - this.spinnerZone.size.width,
                canvasSize.height - this.spinnerZone.size.height,
                this.spinnerZone.size.width,
                this.spinnerZone.size.height
            )
        );
    };

    App.Table.View.prototype.initializeClickTooltip = function () {
        var self = this;
        this.clickTooltipDelegate = {
            getCellInfoAtMousePosition: function (position) {
                return self.getCellInfoAtMousePosition(position);
            },

            getCellTimeSerieAtMousePosition: function (position) {
                return self.getCellTimeSerieAtMousePosition(position);
            }
        };
        this.clickTooltip = new Tooltip({ el: this.$canvas, delegate: this.clickTooltipDelegate, trigger: "click", view: this });
    };

    // Limpia el canvas completo
    App.Table.View.prototype.clear = function () {
        var canvasSize = this.getSize();
        this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    App.Table.View.prototype.repaint = function () {
        this.fixHighDpiBlur();
        _.each(this.zones, function (zone) {
            if (zone.needRepaint) {
                zone.repaint();
            }
        });
    };

    App.Table.View.prototype.fixHighDpiBlur = function () {
        // see https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/54027313#54027313
        const dpr = window.devicePixelRatio;
        const width = Math.ceil(this.canvas.clientWidth * dpr);
        const height = Math.ceil(this.canvas.clientHeight * dpr);

        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = `${width / dpr}px`;
        this.canvas.style.height = `${height / dpr}px`;

        this.ctx.scale(dpr, dpr);
        _.each(this.zones, function (zone) {
            zone.needRepaint = true;
        });
    };

    App.Table.View.prototype.forceRepaint = function () {
        this.fixHighDpiBlur();
        this.clear();
        this.leftHeaderZone.calculateIncrementalSize();
        this.topHeaderZone.calculateIncrementalSize();

        this.bodyZone.repaint();
        this.leftHeaderZone.repaint();
        this.topHeaderZone.repaint();
        this.bottomScrollZone.repaint();
        this.rightScrollZone.repaint();
    };

    App.Table.View.prototype.move = function (distance) {
        var self = this;

        var trackedZone = this.clickedZone;
        var originBefore = trackedZone ? new Point(trackedZone.origin.x, trackedZone.origin.y) : null;

        // window.requestAnimationFrame(function () {
        _.each(self.zones, function (zone) {
            zone.move(distance);
        });
        self.repaint();
        // });

        if (trackedZone && this.clickTooltip) {
            var shift = new Point(originBefore.x - trackedZone.origin.x, originBefore.y - trackedZone.origin.y);
            this.clickTooltip.onCanvasScroll(shift, trackedZone.viewPort);
        }
    };

    App.Table.View.prototype.moveToBegin = function () {
        var distance = new Point(0, this.bodyZone.origin.y);
        this.move(distance);
    };

    App.Table.View.prototype.moveToEnd = function () {
        var distance = new Point(0, -this.bodyZone.size.height);
        this.move(distance);
    };

    App.Table.View.prototype.pagedown = function () {
        var distance = new Point(0, -this.bodyZone.viewPort.height);
        this.move(distance);
    };

    App.Table.View.prototype.pageup = function () {
        var distance = new Point(0, this.bodyZone.viewPort.height);
        this.move(distance);
    };

    App.Table.View.prototype.scrollDistance = function (distance) {
        if (distance.x === 0) {
            // rightScroll
            var yDistance = Math.round((this.bodyZone.size.height * distance.y) / this.rightScrollZone.viewPort.height);
            this.move(new Point(0, yDistance));
        } else {
            // bottomScroll
            var xDistance = Math.round((this.bodyZone.size.width * distance.x) / this.bottomScrollZone.viewPort.width);
            this.move(new Point(xDistance, 0));
        }
    };

    App.Table.View.prototype.stepScroll = function (point) {
        var rectangle;
        var direction;
        if (point.x === 0) {
            //rightScroll
            rectangle = this.rightScrollZone.scrollRectangle();
            direction = rectangle.y > point.y ? 1 : -1;
            this.scrollDistance(new Point(0, direction * 10));
        } else {
            //bottonScroll
            rectangle = this.bottomScrollZone.scrollRectangle();
            direction = rectangle.x > point.x ? 1 : -1;
            this.scrollDistance(new Point(direction * 10, 0));
        }
    };

    App.Table.View.prototype.zoneFromPoint = function (point) {
        var zone, scrollRectangle;
        var pointRectangle = Rectangle.createFromPointWithOffset(point);

        if (this.leftHeaderZone.separatorIndexInRectangle(pointRectangle) > 0) {
            zone = "leftHeaderZone-separator";
        } else if (!_.isUndefined(this.topHeaderZone.separatorIndexInRectangle(pointRectangle))) {
            zone = "topHeaderZone-separator";
        } else if (this.leftHeaderZone.containsPoint(point)) {
            zone = "leftHeaderZone";
        } else if (this.topHeaderZone.containsPoint(point)) {
            zone = "topHeaderZone";
        } else if (this.bodyZone.containsPoint(point)) {
            zone = "bodyZone";
        } else if (this.rightScrollZone.containsPoint(point)) {
            scrollRectangle = this.rightScrollZone.scrollRectangle();
            if (scrollRectangle.containsPoint(point)) {
                zone = "rightScrollZone-scrollBar";
            } else {
                zone = "rightScrollZone";
            }
        } else if (this.bottomScrollZone.containsPoint(point)) {
            scrollRectangle = this.bottomScrollZone.scrollRectangle();
            if (scrollRectangle.containsPoint(point)) {
                zone = "bottomScrollZone-scrollBar";
            } else {
                zone = "bottomScrollZone";
            }
        }
        return zone;
    };

    App.Table.View.prototype.update = function () {
        this.setZonesViewPorts();
        this.clearSelection();
        this.forceRepaint();
    };

    App.Table.View.prototype.resize = function (size) {
        var DELTA = 5;
        var sizeChangeIsSignificative = Math.abs(this.canvas.width - size.width) > DELTA || Math.abs(this.canvas.height - size.height) > DELTA;
        if (!sizeChangeIsSignificative) {
            return;
        }
        this.canvas.width = size.width;
        this.canvas.height = size.height;

        // this is because canvas css size is independent of canvas internal size and
        // is required by the fix for high DPI screens
        this.canvas.style.width = size.width + 'px';
        this.canvas.style.height = size.height + 'px';

        this.update();
        this.clickTooltip.setEl(this.$canvas);
    };

    App.Table.View.prototype.isSelectionActive = function (selection) {
        return (!_.difference(selection.rows, this.selection.rows).length) &&
            (!_.difference(selection.rowsCells, this.selection.rowsCells).length) &&
            (!_.difference(selection.columns, this.selection.columns).length);
    };

    App.Table.View.prototype.toggleArrays = function (a, b) {
        var result;
        var diff = _.difference(b, a);
        if (diff.length) {
            // En la selección nueva hay elementos que no estaban anteriormente, añadir esos elementos nuevos
            result = _.union(a, diff);
        } else {
            // Todos los elementos ya estaban seleccionados, deseleccionar
            result = _.difference(a, b);
        }
        return result;
    };

    App.Table.View.prototype.toggleSelection = function (newSelection) {
        this.selection.rows = this.toggleArrays(this.selection.rows, newSelection.rows);
        this.selection.rows.sort();

        this.selection.rowsCells = this.toggleArrays(this.selection.rowsCells, newSelection.rowsCells);
        this.selection.rowsCells.sort();

        this.selection.columns = this.toggleArrays(this.selection.columns, newSelection.columns);
        this.selection.columns.sort();
    };

    App.Table.View.prototype.clearSelection = function () {
        this.selection = { rowsCells: [], rows: [], columns: [] };
    };

    App.Table.View.prototype.setActiveCell = function (arg) {
        var cell;

        if (arg instanceof Cell) {
            cell = arg;
        } else if (arg instanceof Point) {
            var zone = this.zoneFromPoint(arg);

            if (zone === "bodyZone" || zone === "leftHeaderZone" || zone === "topHeaderZone") {
                if (zone === "bodyZone") {
                    cell = this.bodyZone.cellAtPoint(arg);
                    var isOnlyACellSelected = this.selection.rowsCells.length === 1 && this.selection.columns.length === 1;
                    var firstCellSelectedEqSelectedCell = this.selection.rowsCells[0] === cell.y && this.selection.columns[0] === cell.x;

                    if (isOnlyACellSelected && firstCellSelectedEqSelectedCell) {
                        this.clearSelection();
                    } else {
                        var paintInfoRow = this.bodyZone.getPaintInfoRowCell(cell.y);
                        var selectedRows = paintInfoRow ? [paintInfoRow.index] : [];
                        this.selection = {
                            rowsCells: [cell.y],
                            columns: [cell.x],
                            rows: selectedRows
                        };
                    }

                } else if (zone === "leftHeaderZone") {
                    var rows = this.leftHeaderZone.rowsAtPoint(arg);
                    var rowsCells = this.leftHeaderZone.rowsCellsAtPoint(arg);
                    this.toggleSelection({ rows: rows, rowsCells: rowsCells });
                } else {
                    //topHeaderZone
                    var columns = this.topHeaderZone.columnsAtPoint(arg);
                    this.toggleSelection({ columns: columns });
                }

                this.repaintZonesWithCells();
            }

        }
    };

    App.Table.View.prototype.isCellClicked = function (cell) {
        return this.clickedCell && this.clickedCell.x === cell.x && this.clickedCell.y === cell.y;
    };

    App.Table.View.prototype.toggleClickedCellByRelativePoint = function (point) {
        var zone = this.findZoneWithCellsAtMousePosition();
        if (!zone || this.clickedCell) {
            this.clearClickedCell();
        } else {
            this.clickedCell = zone.cellAtPoint(point);
            this.clickedZone = zone;
            this.repaintZonesWithCells();
        }
    };

    App.Table.View.prototype.clearClickedCell = function () {
        this.clickedCell = null;
        this.clickedZone = null;
        this.repaintZonesWithCells();
    };

    App.Table.View.prototype.repaintZonesWithCells = function () {
        this.leftHeaderZone.needRepaint = true;
        this.topHeaderZone.needRepaint = true;
        this.bodyZone.needRepaint = true;
        this.repaint();
    };

    App.Table.View.prototype.setMousePosition = function (point, e) {
        this.mouseInCanvas = e.target === this.canvas;
        this.mousePosition = point;
        this.setMouseZone(point);
    };

    App.Table.View.prototype.setMouseZone = function (point) {
        var newZone = this.zoneFromPoint(point);

        var needRepaint = this.mouseZone !== newZone;
        this.mouseZone = newZone;
        if (needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

    App.Table.View.prototype.getTitleAtMousePosition = function (point) {
        var title;
        return title;
    };

    App.Table.View.prototype.getCellInfoAtMousePosition = function (point) {
        var cellInfo;
        var zone = this.findZoneWithCellsAtMousePosition();
        if (zone) {
            cellInfo = zone.cellInfoAtPoint(point);
        }
        return cellInfo;
    };

    App.Table.View.prototype._canDrawLineChart = function () {
        return this.mouseZone === "bodyZone" && this.dataSource.canDrawLineVisualizations();
    };

    App.Table.View.prototype.getCellTimeSerieAtMousePosition = function (point) {
        var timeSerie;
        if (this._canDrawLineChart()) {
            timeSerie = this.bodyZone.cellTimeSerieAtPoint(point);
        }
        return timeSerie;
    };

    App.Table.View.prototype.findZoneWithCellsAtMousePosition = function () {
        var zone;
        if (this.mouseZone === "bodyZone") {
            zone = this.bodyZone;
        } else if (this.mouseZone === "leftHeaderZone") {
            zone = this.leftHeaderZone;
        } else if (this.mouseZone === "topHeaderZone") {
            zone = this.topHeaderZone;
        }
        return zone;
    };

    App.Table.View.prototype.setLastClickZone = function (zone) {
        var needRepaint = this.lastClickZone !== zone;
        this.lastClickZone = zone;
        if (needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

    App.Table.View.prototype.destroy = function () {
        this.clickTooltip.destroy();
    };

    App.Table.View.prototype.columnSeparatorIndex = function (point) {
        var pointRectangle = Rectangle.createFromPointWithOffset(point);
        return this.topHeaderZone.separatorIndexInRectangle(pointRectangle);
    };

    App.Table.View.prototype.leftColumnHeaderSeparatorIndex = function (point) {
        var pointRectangle = Rectangle.createFromPointWithOffset(point);
        return this.leftHeaderZone.separatorIndexInRectangle(pointRectangle);
    };

    App.Table.View.prototype.resizeColumnWidth = function (separatorIndex, distance) {
        this.delegate.resizeColumnWidth(separatorIndex, distance.x);

        this.clear();
        this.bodyZone.calculateIncrementalSize();
        this.setZonesViewPorts();
        this.repaint();
    };

    App.Table.View.prototype.resizeLeftHeaderColumnWidth = function (separatorIndex, distance) {
        this.delegate.resizeLeftHeaderColumnWidth(separatorIndex, distance.x);

        this.clear();
        this.bodyZone.calculateIncrementalSize();
        this.setZonesViewPorts();
        this.repaint();
    };

    App.Table.View.prototype.getCellInfoUnitMeasureMultiplier = function (absolutePoint) {
        return this.bodyZone.getCellInfoUnitMeasureMultiplier(absolutePoint);
    }

}());
