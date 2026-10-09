App.namespace('App.test.indicatorAttributesResponse.identifier');
App.namespace('App.test.indicatorAttributesResponse.metadata');
App.namespace('App.test.indicatorAttributesResponse.data');

App.test.indicatorAttributesResponse.identifier = {
    "type": "indicator",
    "identifier": "IND_ATRIBUTOS_TEST"
};

App.test.indicatorAttributesResponse.metadata = {
    kind: "indicators#indicator",
    code: "IND_ATRIBUTOS_TEST",
    version: "1.0",
    title: { es: "Indicador de prueba de atributos", __default__: "Indicador de prueba de atributos" },
    conceptDescription: { es: "Descripción del indicador de prueba", __default__: "Descripción del indicador de prueba" },
    dimension: {
        GEOGRAPHICAL: {
            code: "GEOGRAPHICAL",
            representation: [
                { code: "ES", title: { es: "España", __default__: "España" }, granularityCode: "COUNTRIES" },
                { code: "ES7", title: { es: "Canarias", __default__: "Canarias" }, granularityCode: "AUTONOMOUS_REGIONS" }
            ]
        },
        TIME: {
            code: "TIME",
            representation: [
                { code: "2022-02-02", title: { es: "2022-02-02", __default__: "2022-02-02" }, granularityCode: "DAILY" }
            ]
        },
        MEASURE: {
            code: "MEASURE",
            representation: [
                { code: "ABSOLUTE", title: { es: "Absoluto", __default__: "Absoluto" } },
                { code: "RATE", title: { es: "Tasa", __default__: "Tasa" } }
            ]
        }
    },
    // Real DATASET/DIMENSION/OBSERVATION attribute definitions, as reported by the indicators metadata API
    attribute: {
        FECHA_ELECCION: {
            code: "FECHA_ELECCION",
            title: { es: "Periodo", __default__: "Periodo" },
            attachmentLevel: "DATASET"
        },
        atributo_dataset_international_string: {
            code: "atributo_dataset_international_string",
            title: { es: "Ajuste", __default__: "Ajuste" },
            attachmentLevel: "DATASET"
        },
        field_dimension_string_territorio: {
            code: "field_dimension_string_territorio",
            title: { es: "Territorio", __default__: "Territorio" },
            attachmentLevel: "DIMENSION",
            dimensions: { dimension: [{ dimensionId: "GEOGRAPHICAL" }], total: 1 }
        },
        field_group_string: {
            code: "field_group_string",
            title: { es: "Ajuste", __default__: "Ajuste" },
            attachmentLevel: "DIMENSION",
            dimensions: { dimension: [{ dimensionId: "GEOGRAPHICAL" }, { dimensionId: "MEASURE" }], total: 2 }
        },
        OBS_CONF: {
            code: "OBS_CONF",
            title: { es: "Confidencialidad de la observación", __default__: "Confidencialidad de la observación" },
            attachmentLevel: "OBSERVATION"
        }
    }
};

App.test.indicatorAttributesResponse.data = {
    kind: "indicators#indicatorData",
    format: ["GEOGRAPHICAL", "TIME", "MEASURE"],
    dimension: {
        GEOGRAPHICAL: { representation: { size: 2, index: { ES: 0, ES7: 1 } } },
        TIME: { representation: { size: 1, index: { "2022-02-02": 0 } } },
        MEASURE: { representation: { size: 2, index: { ABSOLUTE: 0, RATE: 1 } } }
    },
    observation: ["10.00", "20.00", "30.00", "40.00"],
    attributes: [
        { id: "FECHA_ELECCION", value: [{ __default__: "2022-02-02" }] },
        { id: "atributo_dataset_international_string", value: [{ es: "Ajuste ES", en: "Ajuste EN", __default__: "Ajuste ES" }] },
        // Attached to GEOGRAPHICAL only: one value per GEOGRAPHICAL representation
        { id: "field_dimension_string_territorio", value: [{ es: "T1" }, { es: "T2" }] },
        // Attached to GEOGRAPHICAL + MEASURE (a "group"/combined attribute): one value per combination
        { id: "field_group_string", value: [{ es: "G1" }, { es: "G2" }, { es: "G3" }, { es: "G4" }] }
    ],
    // Old, complementary format: one entry per observation, OBSERVATION-level only
    attribute: [
        { OBS_CONF: { code: "OBS_CONF", value: { es: "Dato no disponible", __default__: "Dato no disponible" } } },
        null,
        null,
        null
    ]
};
