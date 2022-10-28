describe("Dataset Metadata", function () {

    var metadata;
    var MEASURE_DIMENSION;
    var MEASURE_DIMENSION_REPRESENTATIONS;

    beforeEach(function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});

        MEASURE_DIMENSION = { "id": "INDICADORES", "label": "Indicadores", "type": "MEASURE_DIMENSION", "hierarchy": false };
        MEASURE_DIMENSION_REPRESENTATIONS = [
            { id: 'INDICE_OCUPACION_HABITACIONES', label: 'Índice de ocupación de habitaciones', decimals: 6, open: true },
            { id: 'INDICE_OCUPACION_PLAZAS', label: 'Índice de ocupación de plazas', decimals: 4, open: false }
        ];
    });

    it('should getIdentifier', function () {
        expect(metadata.getIdentifier()).to.eql('C00025A_000001');
    });

    it('should getLanguages', function () {
        expect(metadata.getLanguages()).to.eql({
            id: ['es', 'en'],
            label: {
                es: 'Español',
                en: 'Ingles'
            }
        });
    });

    it('should getMantainer', function () {
        expect(metadata.getMantainer()).to.eql('ISTAC');
    });

    it('should getTitle', function () {
        expect(metadata.getTitle()).to.eql('Título en español')
    });

    it('should getDescription', function () {
        expect(metadata.getDescription()).to.eql('Descripción en español');
    });

    it.skip('should getLicense', function () {
        expect(metadata.getLicense()).to.eql('Licencia en Español');
    });

    it.skip('should getLicenseUrl', function () {

    });

    it.skip('should getPublisher', function () {

    });

    it('should getUri', function () {
        expect(metadata.getUri()).to.eql('urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:C00025A_000001(001.000)');
    });

    it('should getDimensions', function () {
        expect(metadata.getDimensions()).to.eql([
            { "id": "TIME_PERIOD", "label": "Periodo de tiempo", "type": "TIME_DIMENSION", "hierarchy": true },
            { "id": "TIME_PERIOD_2", "label": "Periodo de tiempo 2", "type": "TIME_DIMENSION", "hierarchy": false },
            MEASURE_DIMENSION,
            { "id": "CATEGORIA_ALOJAMIENTO", "label": "Categoría del alojamiento", "type": "DIMENSION", "hierarchy": false },
            { "id": "DESTINO_ALOJAMIENTO", "label": "Destino del alojamiento", "type": "GEOGRAPHIC_DIMENSION", "hierarchy": false }
        ]);
    });

    describe('getRepresentation', function () {

        it('hierarchy dimension', function () {
            expect(metadata.getRepresentations('TIME_PERIOD')).to.eql([
                { id: 'time_1', label: 'Time 1' },
                { id: 'time_2', label: 'Time 2' },
                { id: 'time_2_1', label: 'Time 2 1', parent: 'time_2' },
                { id: 'time_2_2', label: 'Time 2 2', parent: 'time_2', open: false },
                { id: 'time_2_2_1', label: 'Time 2 2 1', parent: 'time_2_2' },
                { id: 'time_3', label: 'Time 3' }
            ]);
        });

        describe('when dimension is geographical', function () {

            it('should return normcodes', function () {
                expect(metadata.getRepresentations('DESTINO_ALOJAMIENTO')).to.eql([
                    { id: 'EL_HIERRO', label: 'El Hierro', normCode: "TERRITORIO.ELHIERRO" },
                    { id: 'LA_PALMA', label: 'La Palma', normCode: "TERRITORIO.LAPALMA" },
                    { id: 'LA_GOMERA', label: 'La Gomera', normCode: "TERRITORIO.LAGOMERA" },
                    { id: 'TENERIFE', label: 'Tenerife', normCode: "TERRITORIO.TENERIFE" },
                    { id: 'GRAN_CANARIA', label: 'Gran Canaria', normCode: "TERRITORIO.GRANCANARIA" },
                    { id: 'FUERTEVENTURA', label: 'Fuerteventura', normCode: "TERRITORIO.FUERTEVENTURA" },
                    { id: 'LANZAROTE', label: 'Lanzarote', normCode: "TERRITORIO.LANZAROTE" }
                ]);
            });

        });

        describe('when dimension is temporal', function () {
            it('should hierarchize temporal dimension', function() {
                expect(metadata.getRepresentations('TIME_PERIOD_2')).to.eql([
                    { id: '2018', temporalGranularity: 'YEARLY', label: 'Year 2018' },
                    { id: "2018-S1", temporalGranularity: "BIYEARLY", label: '2018-S1', parent: '2018' },
                    { id: '2018-W10', temporalGranularity: 'WEEKLY', label: '2018-W10', parent: '2018-S1' },
                    { id: '2018-M02', temporalGranularity: 'MONTHLY', label: '2018-M02', parent: '2018-S1' },
                    { id: '2018-W06', temporalGranularity: 'WEEKLY', label: '2018-W06', parent: '2018-M02' },
                    { id: '2017-W05', temporalGranularity: 'WEEKLY', label: '2017-W05' },
                    { id: '2016', temporalGranularity: 'YEARLY', label: 'Year 2016' }
                ]);
            });
        });

        it('should order dimensionValues by order field', function () {
            expect(metadata.getRepresentations('INDICADORES')).to.eql(MEASURE_DIMENSION_REPRESENTATIONS);
        });

    });

    it.skip('should getCategories', function () { });

    it.skip('should getDates', function () { });

    it('should getMeasureDimension', function () {
        MEASURE_DIMENSION.representations = MEASURE_DIMENSION_REPRESENTATIONS;
        expect(metadata.getMeasureDimension()).to.eql(MEASURE_DIMENSION);
    });

    describe('decimalsForSelection', function () {

        it('should use dimensionValue decimal if defined', function () {
            var selection = { INDICADORES: 'INDICE_OCUPACION_PLAZAS' };
            expect(metadata.decimalsForSelection(selection)).to.equal(4);
        });

        it('should use relatedDsd decimal value if dimensionValue is not defined', function () {
            var selection = { INDICADORES: 'INDICE_OCUPACION_HABITACIONES' };
            expect(metadata.decimalsForSelection(selection)).to.equal(6);
        });

        it('should use relatedDsd decimal value if not measure dimension value defined', function () {
            var selection = {};
            expect(metadata.decimalsForSelection(selection)).to.equal(4);
        });

    });

    it.skip('should getTotalObservations', function () {
        expect(metadata.getTotalObservations()).to.equal(3);
    });

    it.skip('should getMantainerCitation', function () {

    });

    it('should getTimeDimensions', function () {
        expect(metadata.getTimeDimensions()).to.eql([
            { "id": "TIME_PERIOD", "label": "Periodo de tiempo", "type": "TIME_DIMENSION", "hierarchy": true },
            { "id": "TIME_PERIOD_2", "label": "Periodo de tiempo 2", "type": "TIME_DIMENSION", "hierarchy": true }
        ]);
    });

    it('should getPositions', function () {
        var positions = metadata.getDimensionsPosition();
        expect(positions).to.eql({
            top: ["INDICADORES", "TIME_PERIOD"],
            left: ["CATEGORIA_ALOJAMIENTO", "DESTINO_ALOJAMIENTO"]
        });
    });

    it('should getAutoOpen', function () {
        expect(metadata.getAutoOpen()).to.be.true;
    });

    describe('toJSON', function () {

        it("shouldn't break if some metadata is empty", function () {
            var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
            var datasetHelper = new App.datasource.helper.DatasetHelper();
            var metadataResponse = {
                selectedLanguages: App.test.response.metadata.selectedLanguages,
                metadata: {
                    dimensions: App.test.response.metadata.metadata.dimensions,
                    relatedDsd: App.test.response.metadata.metadata.relatedDsd
                }
            };
            metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: metadataResponse});
            metadata.toJSON();
        });

        it('should work', function () {
            var json = metadata.toJSON();
            var expectedJSON = {
                "title": "Título en español",
                "description": "Descripción en español",
                "hasDescriptors": {
                    "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/operations/C00025A",
                    "name": "Estadística de la Evolución Histórica de la Población"
                },
                "statisticalOperation": {
                    "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/operations/C00025A",
                    "name": "Estadística de la Evolución Histórica de la Población"
                },
                "dates": {

                },
                "hasVersionInfo": "001.000",
                "version": "001.000",
                "versionRationale": "Major: New resource",
                "nextVersion": "Non scheduled update",
                "dateNextUpdate": {
                    text: [
                        {
                            value: "30/07/2013",
                            lang: "en"
                        },
                        {
                            value: "30/07/2013",
                            lang: "pt"
                        },
                        {
                            value: "30/07/2013",
                            lang: "es"
                        },
                        {
                            value: "30/07/2013",
                            lang: "ca"
                        }
                    ]
                },
                "updateFrequency": {
                    "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/SDMX/CL_FREQ/1.0/codes/M",
                    "name": "Mensual"
                },
                "publishers": [
                    "Instituto Canario de Estadística"
                ],
                "hasValidity": "Oficialidad",
                "statisticOfficiality": "Oficialidad",
                "lastUpdate": "2013-07-26T10:48:29.072+01:00",
                "languages": {
                    "id": [
                        "es",
                        "en"
                    ],
                    "label": {
                        "es": "Español",
                        "en": "Ingles"
                    }
                },
                "measureDimension": {
                    "id": "INDICADORES",
                    "label": "Indicadores",
                    "type": "MEASURE_DIMENSION",
                    "hierarchy": false,
                    "representations": [
                        {
                            "id": "INDICE_OCUPACION_HABITACIONES",
                            "open": true,
                            "label": "Índice de ocupación de habitaciones",
                            "decimals": 6
                        },
                        {
                            "id": "INDICE_OCUPACION_PLAZAS",
                            "open": false,
                            "label": "Índice de ocupación de plazas",
                            "decimals": 4
                        }
                    ]
                },
                "dimensions": [
                    {
                        "id": "TIME_PERIOD",
                        "label": "Periodo de tiempo",
                        "type": "TIME_DIMENSION",
                        "hierarchy": true
                    },
                    {
                        "id": "INDICADORES",
                        "label": "Indicadores",
                        "type": "MEASURE_DIMENSION",
                        "hierarchy": false
                    },
                    {
                        "id": "CATEGORIA_ALOJAMIENTO",
                        "label": "Categoría del alojamiento",
                        "type": "DIMENSION",
                        "hierarchy": false
                    },
                    {
                        "id": "DESTINO_ALOJAMIENTO",
                        "label": "Destino del alojamiento",
                        "type": "GEOGRAPHIC_DIMENSION",
                        "hierarchy": false
                    }
                ],
                "apiUrl": {
                    "href": "/datasets/ISTAC/C00025A_000001/001.000",
                    "name": "/datasets/ISTAC/C00025A_000001/001.000"
                },
                "apiDocumentationUrl": {
                    "href": "",
                    "name": ""
                },
                "visualizerUrlForWidget": "http://localhost:3000/src/test/javascript/runner/runner.html?agencyId=ISTAC&resourceId=C00025A_000001&version=001.000&resourceType=dataset"
            };
            // console.log(JSON.stringify(json)); console.log(JSON.stringify(expectedJSON));
            expect(JSON.stringify(json)).to.eql(JSON.stringify(expectedJSON));
        });

    });

});