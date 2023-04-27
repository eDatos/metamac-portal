(function () {
    "use strict";

    App.namespace("App.widget.FilterOptions");

    var Restriction = App.widget.FilterOptionsDimensionRestriction;

    var _restrictionProxyEvents = ["change", "select", "unselect"];

    App.widget.FilterOptions = function (options) {
        this.initialize(options);
    };

    App.widget.FilterOptions.prototype = {

        initialize : function (options) {
            this.metadata = options.metadata;
            this._initializeDimensions();
            this._initializeDimensionsMap();
            this._initializePositionLimits();
            this._initializePositions();
            this._initializeDimensionRestrictions();
            this._initializeTableInfo();

            this.setZoneLengthRestriction({left : -1, top : -1});
            this.setSelectedCategoriesRestriction({});
        },

        /**
         * Inicializa las dimension en función de los metadata
         */
        _initializeDimensions : function () {
            // Array for better access with number
            this.dimensions = this.metadata.getDimensionsAndRepresentations();

            for (var i = 0; i < this.dimensions.length; i++) {
                var dimension = this.dimensions[i];

                dimension.number = i;
                for (var j = 0; j < dimension.representations.length; j++) {
                    var representation = dimension.representations[j];
                    representation.number = j;
                }
            }
        },

        _initializeDimensionsMap : function () {
            // Map for better access with ID
            var self = this;
            this.dimensionsMap = {};
            _.each(this.dimensions, function (dimension) {
                self.dimensionsMap[dimension.id] = dimension;
            });
        },

        /**
         * Constantes para los limits de las posiciones de las dimensiones
         */
        _initializePositionLimits : function () {
            this.positionLimit = {
                left : {
                    begin : 0,
                    end : 19
                },
                sectors : {
                    begin : 0,
                    end : 0
                },
                map : {
                    begin : 0,
                    end : 0
                },
                horizontal : {
                    begin : 0,
                    end : 0
                },
                columns : {
                    begin : 20,
                    end : 20
                },
                bars : {
                    begin : 20,
                    end : 20
                },
                lines : {
                    begin : 20,
                    end : 20
                },
                top : {
                    begin : 20,
                    end : 39
                },
                fixed : {
                    begin : 40,
                    end : 59
                },
                axisy : {
                    begin : 60,
                    end : 79
                }
            };
        },

        _findDimensionsByIds : function (ids) {
            return _.map(ids, function (dimensionId) {
                return _.findWhere(this.dimensions, {id : dimensionId});
            }, this);
        },

        _assignPositions : function (dimensions, firstPosition) {
            _.each(dimensions, function (dimension, i) {
                dimension.position = firstPosition + i;
            });
        },

        /**
         *  Inicializa las posición según la información del metadata
         */
        _initializePositions : function () {
            var positions = this.metadata.getDimensionsPosition();
            var leftDimensions = this._findDimensionsByIds(positions.left);
            var topDimensions = this._findDimensionsByIds(positions.top);

            this._assignPositions(leftDimensions, this.positionLimit.left.begin);
            this._assignPositions(topDimensions, this.positionLimit.top.begin);

            var dimensionsOutOfPosition = _.filter(this.dimensions, function (dimension) {
                return _.isUndefined(dimension.position);
            });
            this._assignPositions(dimensionsOutOfPosition, this.positionLimit.fixed.begin);
        },

        /**
         *  Inicializa las restricciones de las dimensiones
         */
        _initializeDimensionRestrictions : function () {
            _.each(this.dimensions, function (dimension) {
                var categoriesIds = _.pluck(dimension.representations, "id");
                dimension.restriction = new Restriction({categories : categoriesIds});
            }, this);
            this._bindDimensionRestrictionsEvents();
        },

        _bindDimensionRestrictionsEvents : function () {
            _.each(this.dimensions, function (dimension) {
                dimension.restriction.on('all', function (eventFullName, options) {
                    var eventName = eventFullName.substring(0, eventFullName.indexOf(":"));
                    if (_.contains(_restrictionProxyEvents, eventName)) {
                        options.dimension = dimension;
                        this.trigger(eventName + ":dimension:" + dimension.id + ":category:" + options.category, options);
                    } else {
                        this.trigger.apply(this, arguments);
                    }
                }, this);

                dimension.restriction.on('change', this._initializeTableInfo, this);

            }, this);
        },

        _simplifyDimensions : function (dimensions) {
            var self = this;
            return _.map(dimensions, function (dimension) {
                return self._simplifyDimension(dimension);
            });
        },

        _simplifyDimension : function (dimension) {
            var result = _.pick(dimension, "id", "number", "label", "type", "hierarchy");
            result.categories = this._simplifyCategories(dimension);
            return result;
        },

        _simplifyCategories : function (dimension) {
            var self = this;
            return _.map(dimension.representations, function (category) {
                return self._simplifyCategory(dimension, category);
            });
        },

        _simplifyCategory : function (dimension, category) {
            var result = _.extend({}, category);
            result.state = dimension.restriction.isCategorySelected(category.id) ? 1 : 0;
            return result;
        },

        getDimensions : function () {
            return this._simplifyDimensions(this.dimensions);
        },

        _isValidZone : function (zone) {
            return (zone === "left") ||
                (zone === "sectors") ||
                (zone === "map") ||
                (zone === "horizontal") ||
                (zone === "columns") ||
                (zone === "bars") ||
                (zone === "lines") ||
                (zone === "top") ||
                (zone === "fixed") ||
                (zone === "axisy");
        },

        _getDimensionsInZone : function (zone) {
            if (!this._isValidZone(zone)) {
                throw "Invalid Zone";
            }
            var zoneLimits = this.positionLimit[zone];
            return _.filter(this.dimensions, function (dimension) {
                return dimension.position >= zoneLimits.begin && dimension.position <= zoneLimits.end
            });
        },

        _getDimensionsNotInZone : function (zone) {
            var zoneLimits = this.positionLimit[zone];
            return _.filter(this.dimensions, function (dimension) {
                return dimension.position < zoneLimits.begin || dimension.position > zoneLimits.end
            });
        },

        _sortDimensionsByPosition : function (dimensions) {
            return _.sortBy(dimensions, function (dimension) {
                return dimension.position;
            });
        },

        getLeftDimensions : function () {
            var leftDimensions = this._getDimensionsInZone("left");
            leftDimensions = this._sortDimensionsByPosition(leftDimensions);
            return this._simplifyDimensions(leftDimensions);
        },

        getSectorsDimension : function () {
            return this.getLeftDimensions()[0];
        },

        getMapDimension : function () {
            return this.getLeftDimensions()[0];
        },

        getHorizontalDimension : function () {
            return this.getLeftDimensions()[0];
        },

        getColumnsDimension : function () {
            return this.getTopDimensions()[0];
        },

        getLinesDimension : function () {
            return this.getTopDimensions()[0];
        },

        getDimensionsInZone : function (zone) {
            var dimensions = this._getDimensionsInZone(zone);
            dimensions = this._sortDimensionsByPosition(dimensions);
            return this._simplifyDimensions(dimensions);
        },

        getTopDimensions : function () {
            var topDimensions = this._getDimensionsInZone("top");
            topDimensions = this._sortDimensionsByPosition(topDimensions);
            return this._simplifyDimensions(topDimensions);
        },

        getFixedDimensions : function () {
            var fixedDimensions = this._getDimensionsInZone("fixed");
            fixedDimensions = this._sortDimensionsByPosition(fixedDimensions);
            return this._simplifyDimensions(fixedDimensions);
        },

        getDimensionsSize : function () {
            return this.dimensions.length();
        },

        _getDimension : function (dimension) {
            if (_.isString(dimension)) {
                return this.dimensionsMap[dimension];
            } else if (_.isNumber(dimension)) {
                return this.dimensions[dimension];
            }
        },

        /**
         * @param {String|Number} dimension
         */
        getDimension : function (dimension) {
            var result = this._getDimension(dimension);
            return this._simplifyDimension(result);
        },

        /**
         * @param {String|Number} param
         */
        getCategories : function (param) {
            var self = this;
            if (param !== undefined) {
                var dimension = this._getDimension(param);
                if (dimension) {
                    return this._simplifyCategories(dimension);
                }
            } else {
                return _.map(this.dimensions, function (dimension) {
                    return self._simplifyCategories(dimension);
                });
            }
        },

        /**
         *
         * @param {String|Number} dimension
         * @param {String|Number} category
         */
        getCategory : function (dimension, category) {
            var dimension = this._getDimension(dimension);
            if (dimension) {
                var result;
                if (_.isString(category)) {
                    result = _.find(dimension.representations, function (representation) {
                        return representation.id === category;
                    });
                } else if (_.isNumber(category)) {
                    result = dimension.representations[category];
                }
                return this._simplifyCategory(dimension, result);
            }
        },

        /**
         * @dimension {String|Number} dimension
         */
        getSelectedCategories : function (dimension) {
            if (dimension !== undefined) {
                var _dimension = this._getDimension(dimension);
                if (_dimension) {
                    var categories = this.getCategories(dimension);
                    return _.filter(categories, function (category) {
                        return category.state === 1;
                    });
                }
            }
        },

        /**
         * Activa o desactiva una categoria
         * @param {String|Number} dimension
         */
        toggleCategoryState : function (dimension, category) {
            var _dimension = this._getDimension(dimension);
            var _category = this.getCategory(dimension, category);

            var selected = _dimension.restriction.toggleCategorySelection(_category.id);

            return selected;
        },

        getZoneFromDimension : function (dimension) {
            var _dimension = this._getDimension(dimension);
            return this._getZoneFromPosition(_dimension.position);
        },

        _getZoneFromPosition : function (position) {
            if (position >= this.positionLimit.left.begin && position <= this.positionLimit.left.end) {
                return "left";
            } else if (position >= this.positionLimit.top.begin && position <= this.positionLimit.top.end) {
                return "top";
            } else if (position >= this.positionLimit.fixed.begin && position <= this.positionLimit.fixed.end) {
                return "fixed";
            } else if (position >= this.positionLimit.axisy.begin && position <= this.positionLimit.axisy.end) {
                return "axisy";
            }
        },

        _removeDimensionCurrentZone : function (dimension, silent) {
            var currentPosition = dimension.position;
            var zone = this._getZoneFromPosition(dimension.position);
            dimension.position = -1;

            _.each(this._getDimensionsInZone(zone), function (dimension) {
                if (dimension.position > currentPosition) {
                    dimension.position = dimension.position - 1;
                }
            });
            this._initializeTableInfo();

            if (!silent) {
                this.trigger('change');
            }
        },

        _appendDimensionToZone : function (dimension, zone, silent) {
            var dimensionsInZone = this._getDimensionsInZone(zone);
            var maxDimension = _.max(dimensionsInZone, function (dimension) {
                return dimension.position;
            });
            dimension.position = maxDimension != -Infinity ? maxDimension.position + 1 : this.positionLimit[zone].begin;

            this._applySelectedCategoriesRestriction(silent);

            this._initializeTableInfo();

            if (!silent) {
                this.trigger('change');
            }
        },

        _changeDimensionZone : function (dimension, zone, silent) {
            var dimension = this._getDimension(dimension);
            this._removeDimensionCurrentZone(dimension, silent);
            this._appendDimensionToZone(dimension, zone, silent);
        },

        /**
         * @param {Number|String} dimension
         * @param {String} zone top|left|fixed
         * @param {boolean} [silent] if true don't trigger change event
         */
        changeDimensionZone : function (dimension, destZone, silent) {
            var srcZone = this.getZoneFromDimension(dimension);
            if (srcZone === destZone) return;

            var dimensionsInDestZone = this.getDimensionsInZone(destZone);

            var destZoneHasRestriction = this.zoneLengthRestriction[destZone] > 0;
            var srcZoneHasRestriction = this.zoneLengthRestriction[srcZone] > 0;

            if (destZoneHasRestriction || srcZoneHasRestriction) {
                this._changeDimensionZone(_.last(dimensionsInDestZone).id, srcZone, true);   //this is a dimension swap?
            }
            this._changeDimensionZone(dimension, destZone, true);

            this._initializeTableInfo();
            if (!silent) {
                this.trigger('change');
            }
        },

        /**
         * Intercambia la posición de dos dimensiones
         * @param {String|Number} dimension1
         * @param {String|Number} dimension2
         * @param {boolean} [silent] if true don't trigger change event
         */
        swapDimensions : function (dimension1, dimension2, silent) {
            var dimension1 = this._getDimension(dimension1);
            var dimension2 = this._getDimension(dimension2);

            if (dimension1.id === dimension2.id) return;

            var aux = dimension1.position;

            //Intercambia la posición
            dimension1.position = dimension2.position;
            dimension2.position = aux;

            this._applySelectedCategoriesRestriction(true);

            this._initializeTableInfo();

            if (!silent) {
                this.trigger('change');
            }
        },

        _dimensionToMoveLeftOrder : function () {
            return _.flatten([this.getLeftDimensions(), this.getTopDimensions(), this.getFixedDimensions()])
        },

        _dimensionToMoveTopInOrder : function () {
            return _.flatten([this.getTopDimensions(), this.getLeftDimensions(), this.getFixedDimensions()])
        },

        /**
         * @param {Number | {type : String, preferedType : String, value : Number }} restriction.top
         * @param {Number | {type : String, preferedType : String, value : Number }} restriction.left
         */
        setZoneLengthRestriction : function (restriction) {
            var self = this;
            this.zoneLengthRestriction = restriction;
            this._applyZoneLengthRestriction();
        },

        _applyZoneLengthRestriction : function (silent) {
            var self = this;
            var restriction = this.zoneLengthRestriction;
            var left = _.isNumber(restriction.left) ? { value : restriction.left } : restriction.left;
            var top = _.isNumber(restriction.top) ? { value : restriction.top } : restriction.top;
            var movedDimensions = {};

            var filterByDimensionType = function (type, dimension) {
                if (type) {
                    return dimension.type === type;
                }
                return true;
            };

            var notAlreadyMoved = function (dimension) {
                return _.isUndefined(movedDimensions[dimension.number]);
            };

            var moveDimensions = function (dimensions, max, type, destinyZone) {
                var result = _.chain(dimensions)
                    .filter(notAlreadyMoved)
                    .filter(_.bind(filterByDimensionType, this, type))
                    .take(max)
                    .map(function (dimension) {
                        self._changeDimensionZone(dimension.number, destinyZone, silent);
                        movedDimensions[dimension.number] = dimension.number;
                        return dimension;
                    }).value();
                return result.length;
            };

            var needMoveToLeft = left.value > 0 ? left.value : 0;
            var needMoveToTop = top.value > 0 ? top.value : 0;
            var leftType = left.type ? left.type : left.preferedType;
            var topType = top.type ? top.type : top.preferedType;

            var movedToLeftWithStrictType = moveDimensions(this._dimensionToMoveLeftOrder(), needMoveToLeft, leftType, "left");
            var movedToTopWithStrictType = moveDimensions(this._dimensionToMoveTopInOrder(), needMoveToTop, topType, "top");

            if (left.preferedType) {
                moveDimensions(this._dimensionToMoveLeftOrder(), needMoveToLeft - movedToLeftWithStrictType, undefined, "left");
            }

            if (top.preferedType) {
                moveDimensions(this._dimensionToMoveTopInOrder(), needMoveToTop - movedToTopWithStrictType, undefined, "top");
            }

            // Delete extra dimensions from each side
            var dimensionsToFix = [];
            if (left.value >= 0) dimensionsToFix.push(this.getLeftDimensions());
            if (top.value >= 0) dimensionsToFix.push(this.getTopDimensions());
            _.chain(dimensionsToFix)
                .flatten()
                .filter(notAlreadyMoved)
                .each(function (dimension) {
                    self._changeDimensionZone(dimension.number, "fixed", silent);
                });

            if (!silent) {
                this.trigger('zoneLengthRestriction', {restriction : restriction});
            }
        },

        _applySelectedCategoriesRestriction : function (silent) {
            var self = this;
            _.each(this._selectedCategoriesRestriction, function (restriction, zone) {
                var dimensions = self._getDimensionsInZone(zone);
                _.each(dimensions, function (dimension) {
                    if (dimension.type === "TIME_DIMENSION") {
                        var representationIdWithNormCode = _.chain(dimension.representations)
                            .filter(function (representation) {
                                return representation.normCode != null;
                            })
                            .pluck("id")
                            .value();
                        dimension.restriction.setRestrictionWithPriorityOrder(restriction, representationIdWithNormCode, {silent : silent});
                    } else {
                        dimension.restriction.setRestriction(restriction, {silent : silent});
                    }
                });
            });
        },

        /**
         * Establece el número máximo de elementos que se pueden seleccionar
         * en una zona
         * @param {Number} [restriction.left]
         * @param {Number} [restriction.sectors]
         * @param {Number} [restriction.map]
         * @param {Number} [restriction.horizontal]
         * @param {Number} [restriction.columns]
         * @param {Number} [restriction.lines]
         * @param {Number} [restriction.top]
         */
        setSelectedCategoriesRestriction : function (restriction) {
            this._selectedCategoriesRestriction = _.extend(restriction, {fixed : 1});
            this._applySelectedCategoriesRestriction();
            this.trigger('selectedCategoriesRestriction', {restriction : restriction});
        },

        selectAllCategories : function (dimension) {
            var dim = this._getDimension(dimension);
            dim.restriction.selectAll();
        },

        unselectAllCategories : function (dimension) {
            var dimension = this._getDimension(dimension);
            var keepLastElement = dimension.type === "TIME_DIMENSION";
            dimension.restriction.unselectAll(keepLastElement);
        },

        areAllCategoriesSelected : function (dimension) {
            var dim = this._getDimension(dimension);
            return dim.restriction.areAllSelected();
        },

        selectCategories : function (dimension, categories) {
            var dim = this._getDimension(dimension);
            return dim.restriction.select(categories);
        },

        unselectCategories : function (dimension, categories) {
            var dim = this._getDimension(dimension);
            return dim.restriction.unselect(categories);
        },

        /**
         * Crea una nueva instancia de filterOptions
         */
        clone : function () {
            var cloned = new App.widget.FilterOptions({metadata : this.metadata});
            cloned.reset(this);
            return cloned;
        },

        /**
         * Copia todos los valores del filter options al
         * @param filterOptions
         */
        reset : function (filterOptions, silent) {
            this.metadata = filterOptions.metadata;
            this.positionLimit = _.clone(filterOptions.positionLimit);
            this._selectedCategoriesRestriction = _.extend({}, filterOptions._selectedCategoriesRestriction);

            this.dimensions = _.map(filterOptions.dimensions, function (dimension) {
                var newDimension = _.pick(dimension, "id", "label", "number", "position", "type", "hierarchy");

                newDimension.representations = _.map(dimension.representations, function (representation) {
                    return _.clone(representation);
                });
                newDimension.restriction = dimension.restriction.clone();

                return newDimension;
            });
            this._initializeDimensionsMap();
            this._initializeTableInfo();
            this._bindDimensionRestrictionsEvents();

            if (!silent) {
                this.trigger('reset');
            }
        },

        exportSelection : function () {
            var result = {};
            _.each(this.dimensions, function (dimension) {
                result[dimension.id] = {
                    position : dimension.position,
                    selectedCategories : dimension.restriction.getSelectedCategories()
                }
            });

            return result;
        },

        importSelection : function (selection) {
            var self = this;

            _.each(selection, function (dimensionSelection, dimension) {
                var currentDimension = self._getDimension(dimension);
                currentDimension.position = dimensionSelection.position;
            });

            this.setSelectedCategoriesRestriction({left : -1, top : -1});

            _.each(selection, function (dimensionSelection, dimension) {
                var currentDimension = self._getDimension(dimension);
                currentDimension.restriction.setSelectedCategories(dimensionSelection.selectedCategories);
            });

            this._initializeDimensionsMap();
            this._initializeTableInfo();
        }

    };

    _.defaults(App.widget.FilterOptions.prototype, App.widget.FilterOptionsTable.prototype, Backbone.Events);

}());
