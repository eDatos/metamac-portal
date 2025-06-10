(function () {

    App.namespace('App.dataset.StructuralResourcesApi');

    App.dataset.StructuralResourcesApi = function (options) {
        this.metadata = options ? options.metadata : null;
    };

    App.dataset.StructuralResourcesApi.prototype = {

        _getAjaxRequest: function(url) {
            return function(callback) {
                return $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    jsonp: "_callback",
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                }).success(function (response) {
                    callback(null, response);
                });
            }
        },

        getVariableElements: function(urls, callback) {
            var self = this;
            var loads = _.map(urls, function(url) {
               return self._getAjaxRequest(url);
            });

            async.parallel(loads, function (err, result) {
                callback(result);
            });
        },

        getCodelists: function (callback) {
            var self = this;
            var loads = _.map(this.metadata.codelistUrls, function (url) {
                return self._getAjaxRequest(url);
            });

            async.parallel(loads, function (err, result) {
                callback(result);
            });
        },

        getOrganisation: function (callback) {
            var requestParams = {
                url: this.buildOrganisationUrl() + "?_type=json",
                method: "GET",
                dataType: 'jsonp',
                jsonp: '_callback',
                headers: {
                    "api-key": App.config["apiKey"]
                }
            };
            $.ajax(requestParams).
                done(function (response) {
                    callback(null, response);
                })
                .fail(function () {
                    callback("Error fetching organisation");
                });
        },

        // Output: "http://estadisticas.arte-consultores.com/structural-resources/latest/agencyschemes/SDMX/AGENCIES/1.0/agencies/ISTAC"
        buildOrganisationUrl: function () {
            var organisationIdentifier = App.URNUtils.getIdentifierFromUrn(App.config["organisationUrn"]);
            return [
                App.endpoints["structural-resources"],
                "agencyschemes",
                organisationIdentifier.agency,
                organisationIdentifier.identifier,
                organisationIdentifier.version,
                "agencies",
                organisationIdentifier.organisation
            ].join('/');
        },

        getDimensions: function (callback) {

            if (!this.metadata.metadata.relatedDsd.selfLink) { return; }

            var requestParams = {
                url: this.metadata.metadata.relatedDsd.selfLink.href + "?_type=json",
                method: "GET",
                dataType: 'jsonp',
                jsonp: '_callback',
                headers: {
                    "api-key": App.config["apiKey"]
                }
            };

            $.ajax(requestParams).
                done(function (response) {
                    var result = _.map(response.dataStructureComponents.dimensions.dimension, function (dimension) {
                        return dimension;
                    });
                    callback(null, result);
                })
                .fail(function () {
                    callback("Error fetching related dsd");
                });
        },

        getDimensionsConcepts: function (dimensions, callback) {
            var conceptItems = _.map(dimensions, function (dimension) {
                return dimension.conceptIdentity;
            });
            this.getConcepts(conceptItems, callback);
        },

        getConcepts: function (conceptItems, callback) {
            var results = [];
            var promises = [];
            _.each(conceptItems, function (conceptItem) {

                var requestParams = {
                    url: conceptItem.selfLink.href + "?_type=json",
                    method: "GET",
                    dataType: 'jsonp',
                    jsonp: '_callback',
                    headers: {
                        "api-key": App.config["apiKey"]
                    }
                };

                promises.push(
                    $.ajax(requestParams)
                        .done(function (response) {
                            results.push(response);
                        })
                        .fail(function () {
                            callback("Error fetching concept");
                        })
                );
            });
            $.when
                .apply($, promises)
                .done(function () {
                    callback(null, results);
                });
        },

        getMeasureConcepts: function (callback) {
            var measureConcept;
            if (this.metadata.metadata.measureCoverages) {
                measureConcept = this.metadata.metadata.measureCoverages.resource;
            } else {
                if (this.metadata.metadata.attributes) {
                    var measureAttribute = _.findWhere(this.metadata.metadata.attributes.attribute, {type: "MEASURE", attachmentLevel: "DATASET"});
                    if (measureAttribute) {
                        measureConcept = measureAttribute.attributeValues.value;
                    }
                }
                if (!measureConcept && this.metadata.metadata.dimensions && this.metadata.metadataResponse.type === "query") {
                    var measureDimension = _.findWhere(this.metadata.metadata.dimensions.dimension, { type: "MEASURE_DIMENSION" });
                    if (measureDimension) {
                        measureConcept = measureDimension.dimensionValues.value;
                    }
                }
            }

            if (measureConcept) {
                if (measureConcept.length === 0) {
                    callback(null, []);
                } else {
                    const conceptSchemeUrlFromListOfConcepts = this.getConceptSchemeUrlFromListOfConcepts(measureConcept);
                    if (conceptSchemeUrlFromListOfConcepts) {
                        this.getConceptsFromConceptSchemeUrl(conceptSchemeUrlFromListOfConcepts, measureConcept, callback);
                    } else {
                        console.info("Could not obtain URL from measure concept", measureConcept);
                    }
                }
            }
        },

        getConceptsFromConceptSchemeUrl: function (conceptSchemeUrl, selectedConcepts, callback) {
            var requestParams = {
                url: conceptSchemeUrl + "/concepts?_type=json&fields=+description,+annotations",
                method: "GET",
                dataType: 'jsonp',
                jsonp: '_callback',
                headers: {
                    "api-key": App.config["apiKey"]
                }
            };

            $.ajax(requestParams)
                .done(function (response) {
                    var filteredResponse = response.concept.filter(function (responseConcept) {
                        return selectedConcepts.some(function (selectedConcept) {
                           return responseConcept.id === selectedConcept.id;
                        });
                    });
                    callback(null, filteredResponse);
                })
                .fail(function () {
                    callback("Error fetching concepts");
                });
        },

        getConceptSchemeUrlFromListOfConcepts: function (conceptItems) {
            if (!conceptItems[0].selfLink) {
                return null;
            }
            var conceptsUrl = new URL(conceptItems[0].selfLink.href);
            conceptsUrl.pathname = conceptsUrl.pathname.replace(/\/concepts\/[^\/]+\/*$/, '');
            return conceptsUrl.toString();
        }
    };

}());
