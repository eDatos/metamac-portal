describe('Indicator attributes', function () {

    beforeEach(function () {
        I18n.defaultLocale = 'es';
    });

    describe('ApiIndicatorResponseToApiResponse.indicatorDatasetAndDimensionAttributesToDataAttributes', function () {

        var convert = function (attributes) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorDatasetAndDimensionAttributesToDataAttributes(attributes);
        };

        it('returns an empty array when there are no attributes (never undefined)', function () {
            expect(convert(undefined)).to.eql([]);
        });

        it('builds a text entry tagged with the platform default locale when the value has no real language', function () {
            var result = convert([{ id: "FECHA_ELECCION", value: [{ __default__: "2022-02-02" }] }]);
            expect(result).to.eql([{
                id: "FECHA_ELECCION",
                values: [{ text: [{ lang: I18n.defaultLocale, value: "2022-02-02" }] }]
            }]);
        });

        it('drops the "__default__" entry when real languages are present', function () {
            var result = convert([{ id: "atributo_i18n", value: [{ es: "Ajuste ES", en: "Ajuste EN", __default__: "Ajuste ES" }] }]);
            expect(result[0].values).to.eql([{
                text: [{ lang: "es", value: "Ajuste ES" }, { lang: "en", value: "Ajuste EN" }]
            }]);
        });

        it('keeps null values as null (no value at that position)', function () {
            var result = convert([{ id: "field_dimension_string_territorio", value: [{ es: "T1" }, null] }]);
            expect(result[0].values).to.eql([
                { text: [{ lang: "es", value: "T1" }] },
                null
            ]);
        });
    });

    describe('ApiIndicatorResponseToApiResponse.indicatorAttributesToDataAttributes', function () {

        var convert = function (attributes, observationAttribute) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorAttributesToDataAttributes(attributes, observationAttribute);
        };

        it('never returns undefined; an empty array with total 0 when there is no attribute data at all', function () {
            expect(convert(undefined, undefined)).to.eql({ attribute: [], internationalAttribute: [], total: 0 });
        });

        it('sums the dataset/dimension attributes and the observation-level ones into a single total', function () {
            var result = convert(
                [{ id: "FECHA_ELECCION", value: [{ __default__: "2022-02-02" }] }],
                [{ OBS_CONF: { code: "OBS_CONF", value: { __default__: "Confidencial" } } }]
            );
            expect(result.total).to.eql(2);
            expect(_.pluck(result.internationalAttribute, 'id')).to.eql(["FECHA_ELECCION", "OBS_CONF"]);
        });
    });

    describe('ApiIndicatorResponseToApiResponse.indicatorMetadataAttributesToMetadataAttributes', function () {

        var convert = function (attributes) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorMetadataAttributesToMetadataAttributes(attributes);
        };

        it('passes through the dimensions the indicator metadata API now reports for a DIMENSION-level attribute', function () {
            var result = convert({
                field_dimension_string_territorio: {
                    code: "field_dimension_string_territorio",
                    title: { es: "Territorio", __default__: "Territorio" },
                    attachmentLevel: "DIMENSION",
                    dimensions: { dimension: [{ dimensionId: "GEOGRAPHICAL" }], total: 1 }
                }
            });
            expect(result.attribute[0].dimensions).to.eql({ dimension: [{ dimensionId: "GEOGRAPHICAL" }], total: 1 });
        });

        it('passes through a multi-dimension (combined/group) attachment as-is', function () {
            var result = convert({
                field_group_string: {
                    code: "field_group_string",
                    title: { es: "Ajuste", __default__: "Ajuste" },
                    attachmentLevel: "DIMENSION",
                    dimensions: { dimension: [{ dimensionId: "GEOGRAPHICAL" }, { dimensionId: "MEASURE" }], total: 2 }
                }
            });
            expect(result.attribute[0].dimensions).to.eql({ dimension: [{ dimensionId: "GEOGRAPHICAL" }, { dimensionId: "MEASURE" }], total: 2 });
        });

        it('leaves dimensions undefined for DATASET/OBSERVATION level attributes', function () {
            var result = convert({
                FECHA_ELECCION: { code: "FECHA_ELECCION", title: { es: "Periodo", __default__: "Periodo" }, attachmentLevel: "DATASET" }
            });
            expect(result.attribute[0].dimensions).to.eql(undefined);
        });

        it('filters out a DIMENSION-level attribute instead of throwing later, when the indicator metadata is incomplete (missing "dimensions")', function () {
            var result = convert({
                atributo_dimension_incompleto: { code: "atributo_dimension_incompleto", title: { es: "Incompleto", __default__: "Incompleto" }, attachmentLevel: "DIMENSION" },
                field_dimension_string_territorio: {
                    code: "field_dimension_string_territorio",
                    title: { es: "Territorio", __default__: "Territorio" },
                    attachmentLevel: "DIMENSION",
                    dimensions: { dimension: [{ dimensionId: "GEOGRAPHICAL" }], total: 1 }
                }
            });
            expect(_.pluck(result.attribute, 'id')).to.eql(["field_dimension_string_territorio"]);
            expect(result.total).to.eql(1);
        });
    });

    describe('ApiIndicatorResponseToApiResponse.indicatorObservationAttributesToDataAttributes', function () {

        var convert = function (attribute) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorObservationAttributesToDataAttributes(attribute);
        };

        it('returns an empty array when there is no per-observation attribute data', function () {
            expect(convert(undefined)).to.eql([]);
        });

        it('returns an empty array when every observation is unflagged (all null)', function () {
            expect(convert([null, null, null])).to.eql([]);
        });

        it('builds one entry per attribute code, with a value per observation position and null elsewhere', function () {
            var result = convert([
                { OBS_CONF: { code: "OBS_CONF", value: { es: "Dato no disponible", __default__: "Dato no disponible" } } },
                null,
                { OBS_CONF: { code: "OBS_CONF", value: { __default__: "Confidencial" } } }
            ]);
            expect(result).to.eql([{
                id: "OBS_CONF",
                values: [
                    { text: [{ lang: "es", value: "Dato no disponible" }] },
                    null,
                    { text: [{ lang: I18n.defaultLocale, value: "Confidencial" }] }
                ]
            }]);
        });
    });

    describe('DataResponse built from the new indicators attributes contract', function () {

        var dataResponse;

        beforeEach(function () {
            SpecUtils.configureI18n('es');

            var datasourceIdentifier = new App.datasource.DatasourceIdentifier(App.test.indicatorAttributesResponse.identifier);
            var indicatorHelper = new App.datasource.helper.IndicatorHelper();
            var metadata = new App.datasource.model.MetadataResponse({
                datasourceIdentifier: datasourceIdentifier,
                datasourceHelper: indicatorHelper,
                response: App.test.indicatorAttributesResponse.metadata
            });

            dataResponse = new App.datasource.model.DataResponse(App.test.indicatorAttributesResponse.data, metadata, indicatorHelper, undefined);
        });

        it('exposes a dataset-level attribute whose value only has a "__default__" translation', function () {
            var attribute = _.findWhere(dataResponse.getDatasetAttributes(), { id: "FECHA_ELECCION" });
            expect(attribute.name).to.eql("Periodo");
            expect(attribute.value.name).to.eql("2022-02-02");
        });

        it('exposes a dataset-level attribute localized to the current locale', function () {
            var attribute = _.findWhere(dataResponse.getDatasetAttributes(), { id: "atributo_dataset_international_string" });
            expect(attribute.value.name).to.eql("Ajuste ES");
        });

        it('does not expose the DIMENSION-level attribute as a dataset attribute', function () {
            expect(_.findWhere(dataResponse.getDatasetAttributes(), { id: "field_dimension_string_territorio" })).to.eql(undefined);
        });

        it('exposes the DIMENSION-level attribute attached to a single dimension, as reported by the metadata', function () {
            var dimensionsAttributes = dataResponse.attributes.getDimensionsAttributes();
            expect(dimensionsAttributes.length).to.eql(1);
            expect(dimensionsAttributes[0].attributeDimensionsIds).to.eql(["GEOGRAPHICAL"]);
            expect(dimensionsAttributes[0].values).to.eql(["T1", "T2"]);
        });

        it('exposes the DIMENSION-level attribute attached to more than one dimension (a "group"/combined attribute)', function () {
            var combinedAttributes = dataResponse.attributes.getCombinatedDimensionsAttributes();
            expect(combinedAttributes.length).to.eql(1);
            expect(combinedAttributes[0].attributeDimensionsIds).to.eql(["GEOGRAPHICAL", "MEASURE"]);
            expect(combinedAttributes[0].values).to.eql(["G1", "G2", "G3", "G4"]);
        });

        it('exposes the OBSERVATION-level attribute (from the old "attribute" field) at the observation it is flagged on', function () {
            var cellAttributes = dataResponse.attributes.getPrimaryMeasureAttributesByPos(0);
            expect(cellAttributes).to.eql([{ value: "Dato no disponible", attribute: "Confidencialidad de la observación" }]);
        });

        it('leaves observations without a flag unaffected', function () {
            var cellAttributes = dataResponse.attributes.getPrimaryMeasureAttributesByPos(1);
            expect(cellAttributes).to.eql([{ value: "", attribute: "Confidencialidad de la observación" }]);
        });
    });

});
