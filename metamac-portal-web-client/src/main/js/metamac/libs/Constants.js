(function () {
    "use strict";

    App.namespace("App.Constants");

    App.Constants = {
        // See variables.less        
        colors: {
            istacBlueWhite: "#B3D9FF",
            istacBlueLight: "#56B5E6",
            istacBlueMedium: "#1C547E",
            istacBlueDark: "#003366",
            istacYellow: '#EBCC5C',

            istacWhite: "#FFFFFF",
            istacGreyLight: "#EBEBEB",
            istacGreyMedium: "#ACACAC",
            istacGreyDark: "#808080",
            istacBlack: "#222222",

            hiddenText: "#FFFFFD"
        },

        font: {
            family: {
                sansSerif: "Helvetica,Arial,sans-serif",
                serif: "serif"
            },
            body: {
                size: "11px"
            },
            title: {
                size: "13px"
            }
        },

        visualization: {
            type: {
                INDICATOR: "indicator",
                INDICATOR_INSTANCE: "indicatorInstance",
                DATASET: "dataset",
                QUERY: "query"
            }
        },

        metadata: {
            defaultDecimals: 2
        },

        attributes: {
            attachmentLevels: {
                PRIMARY_MEASURE: "PRIMARY_MEASURE",
                DIMENSION: "DIMENSION",
                DATASET: "DATASET"
            }
        },

        maxUrlQueryLength: 1700,

        dimension: {
            sortBy: {
                OBSERVATION: "OBSERVATION",
                REPRESENTATION: "REPRESENTATION"
            }
        },

        charts: {
            gap: 5,
            dataAxisWidth: 1.5,
            grid: {
                horizontalMargin: 15,
                topMargin: 10
            },
            lines: {
                xAxisTicks: 6,
                dataZoom: {
                    horizontal: {
                        height: 80,
                        end: 100,
                        partialEnd: 48
                    },
                    vertical: {
                        width: 80,
                        bottomMargin: 20,
                        topMargin: 8
                    }
                }
            },
            legend: {
                fontSize: 12,
                padding: 5,
                itemHeight: 15
            },
            title: {
                fontSize: 9
            },
            tooltip: {
                className: 'chart-tooltip'
            }
        }
    };

}());
